import "server-only";
import { activeOwnerIds } from "@/server/iam";
import { Group } from "@/server/models/Group";

// A teammate's role is which system group they belong to. These three groups
// are seeded (scripts/seed.ts); the UI never exposes raw policies or resources.
export const SYSTEM_ROLES = ["Owner", "Editor", "Viewer"] as const;
export type TRole = (typeof SYSTEM_ROLES)[number];

// Owner wins over Editor wins over Viewer when resolving a single role.
const PRIORITY: TRole[] = ["Owner", "Editor", "Viewer"];

export function isRole(value: unknown): value is TRole {
	return typeof value === "string" && (SYSTEM_ROLES as readonly string[]).includes(value);
}

type GroupMembers = { name: string; members?: unknown[] };

// The highest-priority system role a user belongs to, or null if none.
export function roleOf(userId: string, groups: GroupMembers[]): TRole | null {
	for (const role of PRIORITY) {
		const group = groups.find((g) => g.name === role);
		if (group?.members?.some((m) => String(m) === userId)) return role;
	}
	return null;
}

export async function loadSystemGroups(): Promise<GroupMembers[]> {
	return (await Group.find({ name: { $in: SYSTEM_ROLES } })
		.select("name members")
		.lean()) as GroupMembers[];
}

// Put a user in exactly one system group: out of every system group, into `role`.
export async function setUserRole(userId: string, role: TRole): Promise<void> {
	await Group.updateMany({ name: { $in: SYSTEM_ROLES }, members: userId }, { $pull: { members: userId } });
	await Group.updateOne({ name: role }, { $addToSet: { members: userId } });
}

export const LAST_OWNER_MESSAGE = "You cannot remove the last owner — promote another owner first.";

/**
 * Refuses, with a 409 Response, when demoting, disabling, or deleting `targetId`
 * would leave the site with no active owner. Call before any such change.
 */
export async function assertNotLastOwner(targetId: string): Promise<void> {
	const owners = await activeOwnerIds();
	if (owners.length === 1 && owners[0] === targetId) {
		throw Response.json({ error: LAST_OWNER_MESSAGE }, { status: 409 });
	}
}
