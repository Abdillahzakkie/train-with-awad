// Idempotent seeder for the admin/CMS data foundation. Run with `pnpm seed`.
//
// It writes the default site content once (never clobbering edited copy) and
// upserts the ebook/testimonial/faq/plan collections from the typed content
// modules, keyed by a natural key so re-running makes no duplicates.
//
// seedAdmin(): added in the auth wave — AdminUser/Policy/Group seeding is left
// for a later wave and is deliberately not implemented here.

import { existsSync } from "node:fs";
import process from "node:process";
import mongoose from "mongoose";
import { EBOOKS, FAQS, PLANS, TESTIMONIALS } from "@/content";
import { DEFAULT_SITE_CONTENT } from "@/content/defaults";
import { Ebook } from "@/server/models/Ebook";
import { Faq } from "@/server/models/Faq";
import { Plan } from "@/server/models/Plan";
import { SiteContent } from "@/server/models/SiteContent";
import { Testimonial } from "@/server/models/Testimonial";

// Load local env before importing anything that reads process.env (the server
// config validates env at module load). connectToDatabase is imported after.
if (existsSync(".env.local")) {
	process.loadEnvFile(".env.local");
}

const EXPECTED_DB = "train-with-awad";

// Upsert each item keyed by `key`, setting content fields and order every run
// (idempotent — no duplicates) while leaving `status` untouched after the first
// insert so an admin's Draft/Published choice survives a re-seed.
// biome-ignore lint/suspicious/noExplicitAny: a generic model/item shape for the seed.
async function upsertAll(model: any, items: Record<string, any>[], keyField: string, label: string) {
	let inserted = 0;
	let updated = 0;
	for (let i = 0; i < items.length; i++) {
		const { status, ...fields } = items[i];
		const res = await model.updateOne(
			{ [keyField]: items[i][keyField] },
			{ $set: { ...fields, order: i }, $setOnInsert: { status: status ?? "Published" } },
			{ upsert: true },
		);
		if (res.upsertedCount > 0) {
			inserted++;
		} else if (res.modifiedCount > 0) {
			updated++;
		}
	}
	console.log(`${label}: ${inserted} inserted, ${updated} updated, ${items.length} total`);
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

	await mongoose.disconnect();
	console.log("Seed complete.");
}

main().catch(async (error) => {
	console.error(error);
	await mongoose.disconnect().catch(() => {});
	process.exit(1);
});
