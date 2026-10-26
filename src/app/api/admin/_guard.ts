import "server-only";
import { type TAccess, type TResource, requirePermission } from "@/server/iam";
import { NextResponse } from "next/server";

// The single entry point the admin CRUD routes call at the top of every handler:
// returns {session, perms} or throws a 401/403 Response for errorResponse to return.
export function guard(resource: TResource, need: TAccess) {
	return requirePermission(resource, need);
}

// Turns a caught error into a response: a thrown Response (401/403) is returned
// as-is; anything else is logged and becomes an opaque 500 (no internal detail).
export function errorResponse(e: unknown): Response {
	if (e instanceof Response) return e;
	console.error("admin route error:", e);
	return NextResponse.json({ error: "Internal server error." }, { status: 500 });
}
