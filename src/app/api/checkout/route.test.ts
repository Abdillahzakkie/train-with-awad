import { describe, expect, it } from "vitest";

// The checkout route never reaches the database: an unknown slug returns 404 and
// a known slug fails at the disabled Stripe client. No DB connection is opened.
const { POST } = await import("@/app/api/checkout/route");

function postRequest(body: string): Request {
	return new Request("http://localhost:3000/api/checkout", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body,
	});
}

describe("POST /api/checkout (integration)", () => {
	it("404 for an unknown ebook slug", async () => {
		const res = await POST(postRequest(JSON.stringify({ slug: "does-not-exist" })));
		expect(res.status).toBe(404);
	});

	it("503 for a known slug because Stripe is disabled (placeholder key)", async () => {
		const res = await POST(postRequest(JSON.stringify({ slug: "strength-foundations" })));
		expect(res.status).toBe(503);
	});

	it("400 for an invalid body (missing slug)", async () => {
		const res = await POST(postRequest(JSON.stringify({})));
		expect(res.status).toBe(400);
	});
});
