import mongoose, { type HydratedDocument, type InferSchemaType, type Model, model, Schema } from "mongoose";

// A reusable permission grant map held as a free-form document. `managedBy:
// "system"` marks a seeded policy the API refuses to edit or delete.
const policySchema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		description: { type: String, default: "" },
		managedBy: { type: String, enum: ["system", "custom"], default: "custom" },
		document: { type: Schema.Types.Mixed, default: {} },
	},
	{ timestamps: true, minimize: false },
);

type TPolicyFields = InferSchemaType<typeof policySchema> & { createdAt: Date };
export type TPolicyDoc = HydratedDocument<TPolicyFields>;

// Reuse the compiled model across hot reloads; defining it twice throws.
export const Policy: Model<TPolicyFields> =
	(mongoose.models.Policy as Model<TPolicyFields>) ?? model<TPolicyFields>("Policy", policySchema);
