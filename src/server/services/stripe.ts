import { config } from "@/server/config";
import { StripeDisabledError } from "@/server/errors";
import type { ICheckoutEbook } from "@/types";
import Stripe from "stripe";

let client: Stripe | null = null;

// Build the Stripe client lazily and guard every call behind config.stripeEnabled
// so a placeholder key never reaches Stripe. A disabled call throws a typed
// error the route maps to 503.
function stripe(): Stripe {
	if (!config.stripeEnabled) {
		throw new StripeDisabledError();
	}
	if (!client) {
		client = new Stripe(config.STRIPE_SECRET_KEY);
	}
	return client;
}

export interface ICreateCheckoutSessionInput {
	ebook: ICheckoutEbook;
	successUrl: string;
	cancelUrl: string;
}

// Create a hosted Checkout Session for one ebook and return it. Stripe holds the
// charged price (via the price id); the site never ships a hard-coded amount.
// The slug rides in metadata so the webhook can fulfil the right ebook.
export async function createCheckoutSession(input: ICreateCheckoutSessionInput): Promise<Stripe.Checkout.Session> {
	try {
		return await stripe().checkout.sessions.create({
			mode: "payment",
			line_items: [{ price: input.ebook.stripePriceId, quantity: 1 }],
			success_url: input.successUrl,
			cancel_url: input.cancelUrl,
			metadata: { ebookSlug: input.ebook.slug },
		});
	} catch (error) {
		if (error instanceof StripeDisabledError) {
			throw error;
		}
		throw new Error(`create checkout session failed for ${input.ebook.slug}: ${(error as Error).message}`, {
			cause: error,
		});
	}
}

// Verify the webhook signature and parse the event. A bad signature throws, and
// the route maps that to 400.
export function constructWebhookEvent(rawBody: string | Buffer, signature: string): Stripe.Event {
	return stripe().webhooks.constructEvent(rawBody, signature, config.STRIPE_WEBHOOK_SECRET);
}
