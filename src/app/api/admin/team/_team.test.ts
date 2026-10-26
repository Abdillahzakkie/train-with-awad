import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// The guard path imports server-only modules (iam). Neutralise the marker so the
// node test runner can load them; it only throws outside a server bundle.
vi.mock("server-only", () => ({}));

// Point at a throwaway per-run database on the shared Docker Mongo BEFORE any
// server module loads config and reads MONGODB_URI.
const DB_NAME = `train-with-awad-itest-team-${process.pid}-${Date.now()}`;
process.env.MONGODB_URI = `mongodb://127.0.0.1:27018/${DB_NAME}`;

const { AdminUser } = await import("@/server/models/AdminUser");
const { Group } = await import("@/server/models/Group");
const { Policy } = await import("@/server/models/Policy");
const { connectToDatabase } = await import("@/server/db/connect");
const { assertNotLastOwner } = await import("./_team");

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

beforeAll(async () => {
	await connectToDatabase();
	expect(mongoose.connection.name).toContain("itest");
});

afterAll(dropAndDisconnect);

describe("assertNotLastOwner (integration)", () => {
	it("refuses to orphan the only owner, and allows it once a second owner exists", async () => {
		// An Owner policy granting team:full, bound to an Owner group holding one owner.
		const policy = await Policy.create({ name: "Owner", managedBy: "system", document: { team: "full" } });
		const owner1 = await AdminUser.create({
			email: "owner1@test.local",
			passwordHash: "x",
			name: "Owner One",
			status: "active",
		});
		await Group.create({ name: "Owner", managedBy: "system", policies: [policy._id], members: [owner1._id] });

		// The last owner: the guard must refuse with a 409 Response.
		await expect(assertNotLastOwner(String(owner1._id))).rejects.toBeInstanceOf(Response);

		// Add a second owner: removing the first is now safe.
		const owner2 = await AdminUser.create({
			email: "owner2@test.local",
			passwordHash: "x",
			name: "Owner Two",
			status: "active",
		});
		await Group.updateOne({ name: "Owner" }, { $addToSet: { members: owner2._id } });
		await expect(assertNotLastOwner(String(owner1._id))).resolves.toBeUndefined();
	});
});
