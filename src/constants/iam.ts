// The IAM vocabulary for the Train With Awad admin: a flat resource→level map,
// no policy engine. Pure and isomorphic — safe to import from client UI and the
// server alike. Server-only enforcement lives in @/server/iam.

// The admin sections access can be granted on.
export const RESOURCES = [
	"content",
	"ebooks",
	"testimonials",
	"faq",
	"plans",
	"leads",
	"orders",
	"media",
	"settings",
	"team",
] as const;

export type TResource = (typeof RESOURCES)[number];

// Access levels, least to most permissive.
export const ACCESS = ["off", "read", "full"] as const;
export type TAccess = (typeof ACCESS)[number];

const RANK: Record<TAccess, number> = { off: 0, read: 1, full: 2 };

// A policy grant map. A resource maps to "read" or "full"; an omitted resource
// means "off". Maps 1:1 to the Off/View/Manage builder and is always reversible.
export type TPolicyDocument = Partial<Record<TResource, Exclude<TAccess, "off">>>;

// A fully-resolved permission set: every resource present.
export type TPermissions = Record<TResource, TAccess>;

export function emptyPermissions(): TPermissions {
	return Object.fromEntries(RESOURCES.map((r) => [r, "off"])) as TPermissions;
}

// True when the granted level on `resource` meets or exceeds `need`.
export function can(perms: TPermissions, resource: TResource, need: TAccess): boolean {
	return RANK[perms[resource] ?? "off"] >= RANK[need];
}

// Merge policy documents, taking the most permissive grant per resource.
export function mergeDocuments(docs: TPolicyDocument[]): TPermissions {
	const out = emptyPermissions();
	for (const doc of docs) {
		if (!doc) continue;
		for (const r of RESOURCES) {
			const grant = doc[r];
			if (grant && RANK[grant] > RANK[out[r]]) out[r] = grant;
		}
	}
	return out;
}

// Validates untrusted input as a policy document (known resources → read|full).
export function isValidDocument(input: unknown): input is TPolicyDocument {
	if (!input || typeof input !== "object" || Array.isArray(input)) return false;
	for (const [key, value] of Object.entries(input)) {
		if (!RESOURCES.includes(key as TResource)) return false;
		if (value !== "read" && value !== "full") return false;
	}
	return true;
}
