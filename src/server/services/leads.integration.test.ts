import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// Point the server at a throwaway per-run database on the shared Docker Mongo
// BEFORE any server module loads config and reads MONGODB_URI.
const DB_NAME = `train-with-awad-itest-${process.pid}-${Date.now()}`;
process.env.MONGODB_URI = `mongodb://127.0.0.1:27018/${DB_NAME}`;

const { createLead } = await import("@/server/services/leads");
const { Lead } = await import("@/server/models/Lead");
const { connectToDatabase } = await import("@/server/db/connect");

async function dropAndDisconnect(): Promise<void> {
	if (mongoose.connection.readyState === 1 && mongoose.connection.name?.includes("itest")) {
		await mongoose.connection.dropDatabase();
	}
	await mongoose.disconnect();
}

// Survive an interrupted run: a SIGINT/SIGTERM still drops the throwaway DB.
for (const signal of ["SIGINT", "SIGTERM"] as const) {
	process.once(signal, () => {
		void dropAndDisconnect().finally(() => process.exit(1));
	});
}

beforeAll(async () => {
	await connectToDatabase();
	// Fail loudly rather than ever write to the app or dev database.
	expect(mongoose.connection.name).toContain("itest");
});

afterAll(dropAndDisconnect);

describe("createLead (integration)", () => {
	it("writes one Lead with the given fields and returns a doc with _id and createdAt", async () => {
		const input = {
			name: "Awad Tester",
			email: "awad.tester@example.com",
			phone: "+447700900123",
			mode: "online" as const,
			goal: "build strength",
			source: "instagram",
		};

		const before = await Lead.countDocuments();
		const lead = await createLead(input);

		expect(await Lead.countDocuments()).toBe(before + 1);
		expect(lead._id).toBeDefined();
		expect(lead.createdAt).toBeInstanceOf(Date);

		const stored = await Lead.findById(lead._id).lean();
		expect(stored).toMatchObject({
			name: input.name,
			email: input.email,
			phone: input.phone,
			mode: input.mode,
			goal: input.goal,
			source: input.source,
		});
		// Model drops updatedAt by design.
		expect((stored as Record<string, unknown>).updatedAt).toBeUndefined();
	});

	it("does not throw when email is disabled (placeholder key): notifyCoach is swallowed", async () => {
		await expect(
			createLead({ name: "No Email", email: "noemail@example.com", mode: "in-person" }),
		).resolves.toBeDefined();
	});
});
