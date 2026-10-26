import mongoose, { type HydratedDocument, type InferSchemaType, type Model, Schema, model } from "mongoose";

// A group binds policies to admin users. A user's effective permissions are the
// merge of every policy across every group they belong to.
const groupSchema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		description: { type: String, default: "" },
		managedBy: { type: String, enum: ["system", "custom"], default: "custom" },
		policies: [{ type: Schema.Types.ObjectId, ref: "Policy" }],
		members: [{ type: Schema.Types.ObjectId, ref: "AdminUser" }],
	},
	{ timestamps: true },
);

type TGroupFields = InferSchemaType<typeof groupSchema> & { createdAt: Date };
export type TGroupDoc = HydratedDocument<TGroupFields>;

// Reuse the compiled model across hot reloads; defining it twice throws.
export const Group: Model<TGroupFields> =
	(mongoose.models.Group as Model<TGroupFields>) ?? model<TGroupFields>("Group", groupSchema);
