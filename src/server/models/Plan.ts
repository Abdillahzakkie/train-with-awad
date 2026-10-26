import mongoose, { type HydratedDocument, type InferSchemaType, type Model, Schema, model } from "mongoose";

// A "way to train" card, editable in the admin. Mirrors content/plans plus the
// `order`/`status` fields every admin-managed collection carries.
const planSchema = new Schema(
	{
		name: { type: String, required: true },
		priceLabel: { type: String, default: "" },
		blurb: { type: String, default: "" },
		features: { type: [String], default: [] },
		featured: { type: Boolean, default: false },
		ctaHref: { type: String, default: "" },
		order: { type: Number, default: 0 },
		status: { type: String, enum: ["Published", "Draft"], default: "Published" },
	},
	{ timestamps: true },
);

type TPlanFields = InferSchemaType<typeof planSchema> & { createdAt: Date };
export type TPlanDoc = HydratedDocument<TPlanFields>;

// Reuse the compiled model across hot reloads; defining it twice throws.
export const Plan: Model<TPlanFields> =
	(mongoose.models.Plan as Model<TPlanFields>) ?? model<TPlanFields>("Plan", planSchema);
