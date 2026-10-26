import { type InferSchemaType, type Model, model, models, Schema } from "mongoose";

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

export type TOrderDoc = InferSchemaType<typeof orderSchema>;

// Reuse the compiled model across hot reloads; defining it twice throws.
export const Order: Model<TOrderDoc> = (models.Order as Model<TOrderDoc>) ?? model<TOrderDoc>("Order", orderSchema);
