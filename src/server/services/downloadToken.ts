import { createHmac, timingSafeEqual } from "node:crypto";
import { config } from "@/server/config";
import { ServiceError } from "@/server/errors";
import type { TEbookSlug } from "@/types";

// How long a download link stays valid after the order is fulfilled.
const DOWNLOAD_TTL_MS = 48 * 60 * 60 * 1000;

// shortcut: signs with STRIPE_WEBHOOK_SECRET instead of a dedicated secret;
// add DOWNLOAD_TOKEN_SECRET if token lifetime must outlive a webhook-secret rotation.
function sign(payload: string): string {
	return createHmac("sha256", config.STRIPE_WEBHOOK_SECRET).update(payload).digest("base64url");
}

// Mint a signed, time-limited token the download route can verify without a
// database read. Neither a slug nor an email contains a colon, so a colon is a
// safe field separator.
export function mintDownloadToken(ebookSlug: TEbookSlug, email: string): string {
	const expires = Date.now() + DOWNLOAD_TTL_MS;
	const payload = `${ebookSlug}:${email}:${expires}`;
	return Buffer.from(`${payload}:${sign(payload)}`).toString("base64url");
}

export interface IDownloadClaim {
	ebookSlug: TEbookSlug;
	email: string;
	expires: number;
}

// Verify a token's signature and expiry, returning what it grants. Throws a
// ServiceError a route maps to 400 or 403; the download slice reuses this.
export function verifyDownloadToken(token: string): IDownloadClaim {
	let decoded: string;
	try {
		decoded = Buffer.from(token, "base64url").toString("utf8");
	} catch (error) {
		throw new ServiceError("invalid_token", "Download token is malformed.", 400, { cause: error });
	}
	const parts = decoded.split(":");
	if (parts.length !== 4) {
		throw new ServiceError("invalid_token", "Download token is malformed.", 400);
	}
	const [ebookSlug, email, expiresRaw, sig] = parts;
	const expected = sign(`${ebookSlug}:${email}:${expiresRaw}`);
	const sigBuf = Buffer.from(sig);
	const expectedBuf = Buffer.from(expected);
	if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
		throw new ServiceError("invalid_token", "Download token signature is invalid.", 403);
	}
	const expires = Number(expiresRaw);
	if (!Number.isFinite(expires) || Date.now() > expires) {
		throw new ServiceError("expired_token", "Download token has expired.", 403);
	}
	return { ebookSlug, email, expires };
}
