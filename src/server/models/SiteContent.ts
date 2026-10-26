import mongoose, { type HydratedDocument, type InferSchemaType, type Model, Schema, model } from "mongoose";

// One keyed document holding every editable page's copy as a free-form blob. Its
// shape is the SiteContentData contract in @/types; Mixed keeps the schema flat
// while the admin editor and the read layer own the structure.
const siteContentSchema = new Schema(
	{
		key: { type: String, required: true, unique: true, default: "site" },
		data: { type: Schema.Types.Mixed, default: {} },
	},
	{ timestamps: true, minimize: false },
);

type TSiteContentFields = InferSchemaType<typeof siteContentSchema> & { createdAt: Date };
export type TSiteContentDoc = HydratedDocument<TSiteContentFields>;

// Reuse the compiled model across hot reloads; defining it twice throws.
export const SiteContent: Model<TSiteContentFields> =
	(mongoose.models.SiteContent as Model<TSiteContentFields>) ?? model<TSiteContentFields>("SiteContent", siteContentSchema);
