// Idempotent seeder for the admin/CMS data foundation. Run with `pnpm seed`.
//
// It writes the default site content once (never clobbering edited copy) and
// upserts the ebook/testimonial/faq/plan collections from the typed content
// modules, keyed by a natural key so re-running makes no duplicates.
//
// seedAdmin(): creates the owner AdminUser and the Owner/Editor/Viewer system
// policies + groups, binding the owner to the Owner group. Idempotent.

import { existsSync } from "node:fs";
import process from "node:process";
import { RESOURCES, type TPolicyDocument, type TResource } from "@/constants/iam";
import { EBOOKS, FAQS, PLANS, TESTIMONIALS } from "@/content";
import { DEFAULT_SITE_CONTENT } from "@/content/defaults";
import { hashPassword } from "@/server/auth";
import { AdminUser } from "@/server/models/AdminUser";
import { Ebook } from "@/server/models/Ebook";
import { Faq } from "@/server/models/Faq";
import { Group } from "@/server/models/Group";
import { Plan } from "@/server/models/Plan";
import { Policy } from "@/server/models/Policy";
import { SiteContent } from "@/server/models/SiteContent";
import { Testimonial } from "@/server/models/Testimonial";
import mongoose from "mongoose";

// Load local env before importing anything that reads process.env (the server
// config validates env at module load). connectToDatabase is imported after.
if (existsSync(".env.local")) {
	process.loadEnvFile(".env.local");
}

const EXPECTED_DB = "train-with-awad";

// Insert each item keyed by `key` once (idempotent — no duplicates). Every field,
// including content, order and status, is written only on insert ($setOnInsert),
// so a re-seed never overwrites an admin's later edits in the CMS.
// biome-ignore lint/suspicious/noExplicitAny: a generic model/item shape for the seed.
async function upsertAll(model: any, items: Record<string, any>[], keyField: string, label: string) {
	let inserted = 0;
	for (let i = 0; i < items.length; i++) {
		const { status, ...fields } = items[i];
		const res = await model.updateOne(
			{ [keyField]: items[i][keyField] },
			{ $setOnInsert: { ...fields, order: i, status: status ?? "Published" } },
			{ upsert: true },
		);
		if (res.upsertedCount > 0) inserted++;
	}
	console.log(`${label}: ${inserted} inserted, ${items.length - inserted} left untouched, ${items.length} total`);
}

// The three system policies, as resource→level grant documents. Owner holds every
// resource at full; Viewer every resource at read; Editor manages content and
// reads leads/orders. Rebuilt from RESOURCES so a new resource is covered.
const ownerDoc = Object.fromEntries(RESOURCES.map((r) => [r, "full"])) as TPolicyDocument;
const viewerDoc = Object.fromEntries(RESOURCES.map((r) => [r, "read"])) as TPolicyDocument;
const EDITOR_FULL: TResource[] = ["content", "ebooks", "testimonials", "faq", "plans", "media"];
const editorDoc: TPolicyDocument = {
	...(Object.fromEntries(EDITOR_FULL.map((r) => [r, "full"])) as TPolicyDocument),
	leads: "read",
	orders: "read",
};

const SYSTEM_POLICIES = [
	{ name: "Owner", description: "Full access to every section.", document: ownerDoc },
	{ name: "Editor", description: "Manage content; read leads and orders.", document: editorDoc },
	{ name: "Viewer", description: "Read-only access to every section.", document: viewerDoc },
] as const;

// Create the owner admin and the system policies/groups. Idempotent: the owner
// user and each group are created once (never resetting the password or removing
// members); the system policy documents are refreshed each run so they stay
// canonical. The owner is bound to the Owner group via $addToSet.
async function seedAdmin() {
	const email = (process.env.ADMIN_EMAIL || "").toLowerCase();
	const password = process.env.ADMIN_PASSWORD;
	const name = process.env.ADMIN_NAME || "Admin";
	if (!email || !password) {
		throw new Error("refusing to seed admin: ADMIN_EMAIL and ADMIN_PASSWORD must be set");
	}

	const userRes = await AdminUser.updateOne(
		{ email },
		{ $setOnInsert: { email, name, passwordHash: await hashPassword(password), status: "active" } },
		{ upsert: true },
	);
	const user = await AdminUser.findOne({ email }).select("_id").lean();
	console.log(
		userRes.upsertedCount > 0 ? `AdminUser: created owner ${email}` : `AdminUser: owner ${email} already present`,
	);

	let policiesCreated = 0;
	const policyIdByName: Record<string, unknown> = {};
	for (const p of SYSTEM_POLICIES) {
		const res = await Policy.updateOne(
			{ name: p.name },
			{ $set: { description: p.description, managedBy: "system", document: p.document } },
			{ upsert: true },
		);
		if (res.upsertedCount > 0) policiesCreated++;
		const pol = await Policy.findOne({ name: p.name }).select("_id").lean();
		policyIdByName[p.name] = pol?._id;
	}
	console.log(`Policy: ${policiesCreated} created, ${SYSTEM_POLICIES.length} system policies total`);

	let groupsCreated = 0;
	for (const p of SYSTEM_POLICIES) {
		const update: Record<string, unknown> = {
			$set: { description: `${p.name} group.`, managedBy: "system", policies: [policyIdByName[p.name]] },
		};
		// Bind the owner user to the Owner group; never remove existing members.
		if (p.name === "Owner" && user) update.$addToSet = { members: user._id };
		const res = await Group.updateOne({ name: p.name }, update, { upsert: true });
		if (res.upsertedCount > 0) groupsCreated++;
	}
	console.log(`Group: ${groupsCreated} created, ${SYSTEM_POLICIES.length} system groups total`);

	const ownerGroup = await Group.findOne({ name: "Owner" }).select("members").lean();
	const inOwner = ownerGroup?.members?.some((m) => String(m) === String(user?._id));
	console.log(inOwner ? "Owner membership: owner is in Owner group" : "Owner membership: MISSING");
}

async function main() {
	const { connectToDatabase } = await import("@/server/db/connect");
	await connectToDatabase();

	const dbName = mongoose.connection.name;
	if (dbName !== EXPECTED_DB) {
		throw new Error(`refusing to seed: connected to "${dbName}", expected "${EXPECTED_DB}"`);
	}
	console.log(`Seeding database "${dbName}"`);

	// Site content: write the default blob only if absent; never clobber edits.
	const siteRes = await SiteContent.updateOne(
		{ key: "site" },
		{ $setOnInsert: { key: "site", data: DEFAULT_SITE_CONTENT } },
		{ upsert: true },
	);
	console.log(
		siteRes.upsertedCount > 0
			? "SiteContent: created default site content"
			: "SiteContent: already present, left untouched",
	);

	await upsertAll(Ebook, EBOOKS, "slug", "Ebook");
	await upsertAll(Testimonial, TESTIMONIALS, "name", "Testimonial");
	await upsertAll(Faq, FAQS, "question", "Faq");
	await upsertAll(Plan, PLANS, "name", "Plan");

	await seedAdmin();

	await mongoose.disconnect();
	console.log("Seed complete.");
}

main().catch(async (error) => {
	console.error(error);
	await mongoose.disconnect().catch(() => {});
	process.exit(1);
});
