import mongoose, { type HydratedDocument, type InferSchemaType, type Model, model, Schema } from "mongoose";

// The ebook catalogue, editable in the admin. Mirrors content/ebooks plus the
// `order`/`status` fields every admin-managed collection carries.
const ebookSchema = new Schema(
	{
		slug: { type: String, required: true, unique: true },
		title: { type: String, required: true },
		blurb: { type: String, default: "" },
		priceGBP: { type: Number, required: true },
		cover: { type: String, default: "" },
		stripePriceId: { type: String, default: "" },
		order: { type: Number, default: 0 },
		status: { type: String, enum: ["Published", "Draft"], default: "Published" },
	},
	{ timestamps: true },
);

type TEbookFields = InferSchemaType<typeof ebookSchema> & { createdAt: Date };
export type TEbookDoc = HydratedDocument<TEbookFields>;

// Reuse the compiled model across hot reloads; defining it twice throws.
export const Ebook: Model<TEbookFields> =
	(mongoose.models.Ebook as Model<TEbookFields>) ?? model<TEbookFields>("Ebook", ebookSchema);
