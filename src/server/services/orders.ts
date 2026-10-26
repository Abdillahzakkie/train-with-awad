import type Stripe from "stripe";
import { config } from "@/server/config";
import { connectToDatabase } from "@/server/db/connect";
import { ServiceError } from "@/server/errors";
import { Order, type TOrderDoc } from "@/server/models/Order";
import { mintDownloadToken } from "@/server/services/downloadToken";
import { sendDownloadLink } from "@/server/services/email";

// Mongo's duplicate-key error code, raised when the unique stripeSessionId index
// rejects a second write.
const DUPLICATE_KEY = 11000;

function isDuplicateKey(error: unknown): boolean {
	return typeof error === "object" && error !== null && (error as { code?: number }).code === DUPLICATE_KEY;
}

function requireField(session: Stripe.Checkout.Session, value: string | null | undefined, field: string): string {
	if (!value) {
		throw new ServiceError("invalid_session", `Checkout session ${session.id} is missing ${field}.`, 400);
	}
	return value;
}

function buildDownloadUrl(token: string): string {
	return `${config.NEXT_PUBLIC_SITE_URL}/api/download?token=${encodeURIComponent(token)}`;
}

// Fulfil a completed checkout: write one Order and email the download link.
//
// Idempotent on stripeSessionId. A webhook retry finds the existing order and
// returns it without writing a second row or sending a second email. The unique
// index is the race-safe guard; a duplicate-key error resolves to the existing
// order.
export async function fulfilOrder(session: Stripe.Checkout.Session): Promise<TOrderDoc> {
	await connectToDatabase();

	const existing = await Order.findOne({ stripeSessionId: session.id });
	if (existing) {
		return existing;
	}

	const ebookSlug = requireField(session, session.metadata?.ebookSlug, "metadata.ebookSlug");
	const email = requireField(session, session.customer_details?.email ?? session.customer_email, "customer email");
	const currency = requireField(session, session.currency, "currency");
	if (session.amount_total === null || session.amount_total === undefined) {
		throw new ServiceError("invalid_session", `Checkout session ${session.id} is missing amount_total.`, 400);
	}

	const downloadToken = mintDownloadToken(ebookSlug, email);

	try {
		const order = await Order.create({
			ebookSlug,
			email,
			amount: session.amount_total,
			currency,
			stripeSessionId: session.id,
			downloadToken,
			fulfilledAt: new Date(),
		});

		// The order is saved; a failed delivery email is logged, not rethrown, so
		// a webhook retry does not duplicate the order.
		try {
			await sendDownloadLink({ email, ebookSlug, downloadUrl: buildDownloadUrl(downloadToken) });
		} catch (error) {
			console.error("send download link failed; order is saved", { orderId: String(order._id), error });
		}

		return order;
	} catch (error) {
		// A concurrent webhook retry can win the race; the unique index rejects
		// the second write, so resolve to the order that already exists.
		if (isDuplicateKey(error)) {
			const found = await Order.findOne({ stripeSessionId: session.id });
			if (found) {
				return found;
			}
		}
		throw new Error(`write order failed for session ${session.id}: ${(error as Error).message}`, { cause: error });
	}
}
