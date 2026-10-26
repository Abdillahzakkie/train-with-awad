import { type InferSchemaType, type Model, model, models, Schema } from "mongoose";

// A booking enquiry from the contact form. See ARCHITECTURE.md section 8.
const leadSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		phone: { type: String },
		mode: { type: String, enum: ["online", "in-person"], required: true },
		goal: { type: String },
		source: { type: String },
	},
	// The site only ever creates a lead, so record createdAt and drop updatedAt.
	{ timestamps: { createdAt: true, updatedAt: false } },
);

export type TLeadDoc = InferSchemaType<typeof leadSchema>;

// Reuse the compiled model across hot reloads; defining it twice throws.
export const Lead: Model<TLeadDoc> = (models.Lead as Model<TLeadDoc>) ?? model<TLeadDoc>("Lead", leadSchema);
