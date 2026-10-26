import "server-only";
import { cookies } from "next/headers";

// Relying-party config. Defaults target local dev; set WEBAUTHN_RP_ID (the
// registrable domain) and WEBAUTHN_ORIGIN (the full scheme+host) per environment.
export const rpName = process.env.WEBAUTHN_RP_NAME || "Train With Awad";
export const rpID = process.env.WEBAUTHN_RP_ID || "localhost";
export const origin = process.env.WEBAUTHN_ORIGIN || "http://localhost:3000";

const CHALLENGE_COOKIE = "tw_webauthn_chl";

// Stores the in-flight ceremony challenge (short-lived, httpOnly).
export async function setChallenge(challenge: string): Promise<void> {
	const jar = await cookies();
	jar.set(CHALLENGE_COOKIE, challenge, {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: 300,
	});
}

export async function getChallenge(): Promise<string | undefined> {
	const jar = await cookies();
	return jar.get(CHALLENGE_COOKIE)?.value;
}

export async function clearChallenge(): Promise<void> {
	const jar = await cookies();
	jar.delete(CHALLENGE_COOKIE);
}
