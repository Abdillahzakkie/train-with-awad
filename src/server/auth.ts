import "server-only";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { type ISessionPayload, SESSION_COOKIE, signSession, verifySession } from "./jwt";

const ROUNDS = 12;

export function hashPassword(plain: string): Promise<string> {
	return bcrypt.hash(plain, ROUNDS);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
	return bcrypt.compare(plain, hash);
}

// Sets the session cookie. Call from a route handler.
export async function startSession(payload: ISessionPayload): Promise<void> {
	const token = await signSession(payload);
	const jar = await cookies();
	jar.set(SESSION_COOKIE, token, {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: 60 * 60 * 24 * 7,
	});
}

export async function endSession(): Promise<void> {
	const jar = await cookies();
	jar.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<ISessionPayload | null> {
	const jar = await cookies();
	return verifySession(jar.get(SESSION_COOKIE)?.value);
}

// Throws a 401 Response when no valid admin session is present.
export async function requireAdmin(): Promise<ISessionPayload> {
	const session = await getSession();
	if (!session) throw new Response("Unauthorized", { status: 401 });
	return session;
}
