import mongoose, { type HydratedDocument, type InferSchemaType, type Model, model, Schema } from "mongoose";

// A frequently asked question, editable in the admin. Mirrors content/faq plus
// the `order`/`status` fields every admin-managed collection carries.
const faqSchema = new Schema(
	{
		question: { type: String, required: true },
		answer: { type: String, required: true },
		order: { type: Number, default: 0 },
		status: { type: String, enum: ["Published", "Draft"], default: "Published" },
	},
	{ timestamps: true },
);

type TFaqFields = InferSchemaType<typeof faqSchema> & { createdAt: Date };
export type TFaqDoc = HydratedDocument<TFaqFields>;

// Reuse the compiled model across hot reloads; defining it twice throws.
export const Faq: Model<TFaqFields> = (mongoose.models.Faq as Model<TFaqFields>) ?? model<TFaqFields>("Faq", faqSchema);
