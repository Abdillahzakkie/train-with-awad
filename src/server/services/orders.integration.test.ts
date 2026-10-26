import mongoose from "mongoose";
import type Stripe from "stripe";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// Point the server at a throwaway per-run database on the shared Docker Mongo
// BEFORE any server module loads config and reads MONGODB_URI.
const DB_NAME = `train-with-awad-itest-${process.pid}-${Date.now()}`;
process.env.MONGODB_URI = `mongodb://127.0.0.1:27018/${DB_NAME}`;

const { fulfilOrder } = await import("@/server/services/orders");
const { Order } = await import("@/server/models/Order");
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

function fakeSession(id: string): Stripe.Checkout.Session {
	return {
		id,
		metadata: { ebookSlug: "strength-foundations" },
		customer_details: { email: "buyer@example.com" },
		customer_email: null,
		currency: "gbp",
		amount_total: 999,
	} as unknown as Stripe.Checkout.Session;
}

beforeAll(async () => {
	await connectToDatabase();
	expect(mongoose.connection.name).toContain("itest");
	// Build the unique stripeSessionId index before the duplicate-write test runs.
	await Order.init();
});

afterAll(dropAndDisconnect);

describe("fulfilOrder (integration)", () => {
	it("writes one Order with a downloadToken", async () => {
		const session = fakeSession("cs_test_write_one");
		const before = await Order.countDocuments();

		const order = await fulfilOrder(session);

		expect(await Order.countDocuments()).toBe(before + 1);
		expect(order._id).toBeDefined();
		expect(order.stripeSessionId).toBe(session.id);
		expect(order.ebookSlug).toBe("strength-foundations");
		expect(order.email).toBe("buyer@example.com");
		expect(order.amount).toBe(999);
		expect(order.currency).toBe("gbp");
		expect(typeof order.downloadToken).toBe("string");
		expect(order.downloadToken.length).toBeGreaterThan(0);
		expect(order.fulfilledAt).toBeInstanceOf(Date);
	});

	it("is idempotent on stripeSessionId: a second call returns the existing order, no duplicate", async () => {
		const session = fakeSession("cs_test_idempotent");

		const first = await fulfilOrder(session);
		const countAfterFirst = await Order.countDocuments({ stripeSessionId: session.id });
		const second = await fulfilOrder(session);

		expect(countAfterFirst).toBe(1);
		expect(await Order.countDocuments({ stripeSessionId: session.id })).toBe(1);
		expect(String(second._id)).toBe(String(first._id));
		// Same persisted token, not a freshly minted one.
		expect(second.downloadToken).toBe(first.downloadToken);
	});

	it("rejects a manual duplicate insert on stripeSessionId via the unique index", async () => {
		const stripeSessionId = "cs_test_unique_index";
		const base = {
			ebookSlug: "eat-to-perform",
			email: "dup@example.com",
			amount: 799,
			currency: "gbp",
			downloadToken: "token-a",
			fulfilledAt: new Date(),
		};

		await Order.create({ ...base, stripeSessionId });

		await expect(Order.create({ ...base, stripeSessionId, downloadToken: "token-b" })).rejects.toMatchObject({
			code: 11000,
		});
		expect(await Order.countDocuments({ stripeSessionId })).toBe(1);
	});
});
