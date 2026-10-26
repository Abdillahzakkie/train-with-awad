import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// Point the server at a throwaway per-run database on the shared Docker Mongo
// BEFORE the route (and the services it imports) loads config.
const DB_NAME = `train-with-awad-itest-${process.pid}-${Date.now()}`;
process.env.MONGODB_URI = `mongodb://127.0.0.1:27018/${DB_NAME}`;

const { POST } = await import("@/app/api/leads/route");
const { Lead } = await import("@/server/models/Lead");
const { connectToDatabase } = await import("@/server/db/connect");

async function dropAndDisconnect(): Promise<void> {
	if (mongoose.connection.readyState === 1 && mongoose.connection.name?.includes("itest")) {
		await mongoose.connection.dropDatabase();
	}
	await mongoose.disconnect();
}

for (const signal of ["SIGINT", "SIGTERM"] as const) {
	process.once(signal, () => {
		void dropAndDisconnect().finally(() => process.exit(1));
	});
}

function postRequest(body: string): Request {
	return new Request("http://localhost:3000/api/leads", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body,
	});
}

beforeAll(async () => {
	await connectToDatabase();
	expect(mongoose.connection.name).toContain("itest");
});

afterAll(dropAndDisconnect);

describe("POST /api/leads (integration)", () => {
	it("200 {ok:true} and persists a Lead for a valid body", async () => {
		const before = await Lead.countDocuments();
		const res = await POST(postRequest(JSON.stringify({ name: "Route Tester", email: "route@example.com", mode: "online" })));

		expect(res.status).toBe(200);
		await expect(res.json()).resolves.toEqual({ ok: true });
		expect(await Lead.countDocuments()).toBe(before + 1);
		expect(await Lead.findOne({ email: "route@example.com" }).lean()).toMatchObject({
			name: "Route Tester",
			mode: "online",
		});
	});

	it("400 and persists nothing for a body missing email", async () => {
		const before = await Lead.countDocuments();
		const res = await POST(postRequest(JSON.stringify({ name: "No Email", mode: "online" })));

		expect(res.status).toBe(400);
		expect(await Lead.countDocuments()).toBe(before);
	});

	it("400 for a non-JSON body", async () => {
		const res = await POST(postRequest("not json at all"));
		expect(res.status).toBe(400);
	});
});
