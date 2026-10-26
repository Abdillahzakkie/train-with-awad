import { StripeDisabledError } from "@/server/errors";
import { constructWebhookEvent, createCheckoutSession } from "@/server/services/stripe";
import { describe, expect, it } from "vitest";

// The test env uses placeholder Stripe keys, so stripeEnabled is false and every
// call must refuse with the typed disabled error rather than reach Stripe.
describe("stripe service with a placeholder key", () => {
	it("refuses to create a checkout session", async () => {
		await expect(
			createCheckoutSession({
				ebook: { slug: "strength-foundations", title: "Strength Foundations", stripePriceId: "price_x" },
				successUrl: "http://localhost:3000/order",
				cancelUrl: "http://localhost:3000/ebooks/strength-foundations",
			}),
		).rejects.toBeInstanceOf(StripeDisabledError);
	});

	it("refuses to verify a webhook", () => {
		expect(() => constructWebhookEvent("{}", "sig")).toThrow(StripeDisabledError);
	});
});
