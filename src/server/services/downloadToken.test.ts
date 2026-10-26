import { afterEach, describe, expect, it, vi } from "vitest";
import { ServiceError } from "@/server/errors";
import { mintDownloadToken, verifyDownloadToken } from "@/server/services/downloadToken";

describe("downloadToken", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it("verifies a freshly minted token and returns its claim", () => {
		const token = mintDownloadToken("strength-foundations", "buyer@example.com");
		const claim = verifyDownloadToken(token);
		expect(claim.ebookSlug).toBe("strength-foundations");
		expect(claim.email).toBe("buyer@example.com");
	});

	it("rejects a malformed token with a 400", () => {
		expect(() => verifyDownloadToken("not-a-real-token")).toThrowError(expect.objectContaining({ status: 400 }));
	});

	it("rejects a token with a bad signature as 403", () => {
		const forged = Buffer.from("strength-foundations:buyer@example.com:9999999999999:badsig").toString("base64url");
		try {
			verifyDownloadToken(forged);
			throw new Error("expected verifyDownloadToken to throw");
		} catch (error) {
			expect(error).toBeInstanceOf(ServiceError);
			expect((error as ServiceError).status).toBe(403);
		}
	});

	it("rejects an expired token as 403", () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
		const token = mintDownloadToken("eat-to-perform", "buyer@example.com");

		// Past the 48-hour TTL.
		vi.setSystemTime(new Date("2026-01-04T00:00:00Z"));
		expect(() => verifyDownloadToken(token)).toThrowError(expect.objectContaining({ code: "expired_token" }));
	});
});
