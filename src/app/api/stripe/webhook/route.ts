import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { config } from "@/server/config";
import { fulfilOrder } from "@/server/services/orders";
import { constructWebhookEvent } from "@/server/services/stripe";

// Stripe confirms payment here. Verify the signature against the raw body, then
// fulfil a completed checkout: write one order and email the download link.
// Fulfilment is idempotent, so a webhook retry is safe (ARCHITECTURE.md §9).
export async function POST(request: Request) {
	if (!config.stripeEnabled) {
		return new NextResponse("Stripe is not configured.", { status: 503 });
	}

	const signature = request.headers.get("stripe-signature");
	if (!signature) {
		return new NextResponse("Missing Stripe signature.", { status: 400 });
	}

	// The signature is checked against the exact bytes, so read the raw body.
	const rawBody = await request.text();

	let event: Stripe.Event;
	try {
		event = constructWebhookEvent(rawBody, signature);
	} catch (error) {
		console.error("stripe webhook signature verification failed", error);
		return new NextResponse("Invalid signature.", { status: 400 });
	}

	try {
		if (event.type === "checkout.session.completed") {
			await fulfilOrder(event.data.object as Stripe.Checkout.Session);
		}
		console.info("stripe webhook processed", { id: event.id, type: event.type });
		return NextResponse.json({ received: true });
	} catch (error) {
		console.error("stripe webhook handling failed", { type: event.type }, error);
		return new NextResponse("Webhook handler failed.", { status: 500 });
	}
}
