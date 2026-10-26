import "server-only";
import {
	can,
	emptyPermissions,
	mergeDocuments,
	type TAccess,
	type TPermissions,
	type TPolicyDocument,
	type TResource,
} from "@/constants/iam";
import { requireAdmin } from "./auth";
import { connectToDatabase } from "./db/connect";
import { AdminUser } from "./models/AdminUser";
import { Group } from "./models/Group";
import { Policy } from "./models/Policy";

export type { TAccess, TPermissions, TPolicyDocument, TResource } from "@/constants/iam";
// Re-export the pure vocabulary so the server has one IAM entry point. Client
// UI imports these from "@/constants/iam" to avoid pulling in server-only code.
export { ACCESS, can, emptyPermissions, isValidDocument, mergeDocuments, RESOURCES } from "@/constants/iam";

// "team" is the owner resource: team:full is what an owner holds.
const OWNER_RESOURCE: TResource = "team";

type PopulatedGroup = { policies?: Array<{ document?: TPolicyDocument } | null> };

function docsFromGroups(groups: PopulatedGroup[]): TPolicyDocument[] {
	const docs: TPolicyDocument[] = [];
	for (const group of groups) {
		for (const policy of group.policies ?? []) {
			if (policy?.document) docs.push(policy.document);
		}
	}
	return docs;
}

/** Effective permissions from a set of groups, taking the most permissive grant. */
export async function permissionsForGroupIds(groupIds: string[]): Promise<TPermissions> {
	if (groupIds.length === 0) return emptyPermissions();
	await connectToDatabase();
	const groups = (await Group.find({ _id: { $in: groupIds } })
		.populate("policies")
		.lean()) as PopulatedGroup[];
	return mergeDocuments(docsFromGroups(groups));
}

/**
 * A user's effective permissions: the merge of every policy across every group
 * they belong to, most-permissive-wins. A disabled or missing user gets no
 * access at all, so disabling an admin revokes access immediately.
 */
export async function getEffectivePermissions(userId: string): Promise<TPermissions> {
	await connectToDatabase();
	const user = await AdminUser.findById(userId).lean();
	if (!user || user.status === "disabled") return emptyPermissions();
	const groups = (await Group.find({ members: userId }).populate("policies").lean()) as PopulatedGroup[];
	return mergeDocuments(docsFromGroups(groups));
}

/**
 * Active admins whose effective permissions grant team:full — the "owners" the
 * API must never let the last of go.
 *
 * shortcut: N+1 over admins, fine at studio scale (a handful of admins); batch
 * the per-user merge into one aggregate if the admin list ever grows large.
 */
export async function activeOwnerIds(): Promise<string[]> {
	await connectToDatabase();
	const admins = await AdminUser.find({ status: { $ne: "disabled" } })
		.select("_id")
		.lean();
	const owners: string[] = [];
	for (const admin of admins) {
		const perms = await getEffectivePermissions(String(admin._id));
		if (perms[OWNER_RESOURCE] === "full") owners.push(String(admin._id));
	}
	return owners;
}

/**
 * Active owners (team:full) if group `groupId` were changed to `override`'s
 * policies + members, or removed entirely (`override: null`). Lets the groups
 * API refuse any edit or delete that would leave the studio with no owner.
 */
export async function activeOwnersAfterGroupChange(
	groupId: string,
	override: { policyIds: string[]; memberIds: string[] } | null,
): Promise<string[]> {
	await connectToDatabase();
	const admins = await AdminUser.find({ status: { $ne: "disabled" } })
		.select("_id")
		.lean();
	const groups = (await Group.find().populate("policies").lean()) as unknown as Array<
		PopulatedGroup & { _id: unknown; members?: unknown[] }
	>;

	// Rebuild each group as (members, docs), swapping the target group for its
	// simulated state (dropped when override is null).
	const sim: Array<{ members: string[]; docs: TPolicyDocument[] }> = [];
	for (const group of groups) {
		if (String(group._id) === groupId) continue;
		sim.push({ members: (group.members ?? []).map(String), docs: docsFromGroups([group]) });
	}
	if (override) {
		const policies = (await Policy.find({ _id: { $in: override.policyIds } })
			.select("document")
			.lean()) as Array<{ document?: TPolicyDocument }>;
		sim.push({
			members: override.memberIds.map(String),
			docs: policies.map((p) => p.document).filter((d): d is TPolicyDocument => Boolean(d)),
		});
	}

	const owners: string[] = [];
	for (const admin of admins) {
		const uid = String(admin._id);
		const docs: TPolicyDocument[] = [];
		for (const s of sim) if (s.members.includes(uid)) docs.push(...s.docs);
		if (mergeDocuments(docs)[OWNER_RESOURCE] === "full") owners.push(uid);
	}
	return owners;
}

/**
 * Requires a valid admin session (401) with at least `need` on `resource`,
 * else throws a 403 Response. Returns the session plus the effective perms.
 */
export async function requirePermission(resource: TResource, need: TAccess) {
	const session = await requireAdmin();
	const perms = await getEffectivePermissions(session.sub);
	if (!can(perms, resource, need)) throw new Response("Forbidden", { status: 403 });
	return { session, perms };
}

/** An admin user shaped for API responses: `_id` → `id`, never the password. */
export function publicUser<T extends { _id: unknown; passwordHash?: unknown; __v?: unknown }>(doc: T) {
	const { passwordHash: _pw, _id, __v: _v, ...rest } = doc;
	return { ...rest, id: String(_id) };
}
