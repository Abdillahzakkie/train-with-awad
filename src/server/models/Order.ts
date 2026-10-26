import { type HydratedDocument, type InferSchemaType, type Model, Schema, model, models } from "mongoose";

// A paid ebook order, written from the Stripe webhook. See ARCHITECTURE.md
// section 8.
const orderSchema = new Schema(
	{
		ebookSlug: { type: String, required: true },
		email: { type: String, required: true },
		amount: { type: Number, required: true }, // minor units, from Stripe
		currency: { type: String, required: true },
		// Idempotency key: a webhook retry cannot write a second order.
		stripeSessionId: { type: String, required: true, unique: true },
		downloadToken: { type: String, required: true }, // signed, time-limited
		fulfilledAt: { type: Date },
	},
	{ timestamps: { createdAt: true, updatedAt: false } },
);

// InferSchemaType omits _id and the timestamp. Add createdAt, and expose a
// hydrated doc type so callers see _id and the document methods.
type TOrderFields = InferSchemaType<typeof orderSchema> & { createdAt: Date };
export type TOrderDoc = HydratedDocument<TOrderFields>;

// Reuse the compiled model across hot reloads; defining it twice throws.
export const Order: Model<TOrderFields> =
	(models.Order as Model<TOrderFields>) ?? model<TOrderFields>("Order", orderSchema);
