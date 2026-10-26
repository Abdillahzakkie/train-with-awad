import { type HydratedDocument, type InferSchemaType, type Model, model, models, Schema } from "mongoose";

// A booking enquiry from the contact form. See ARCHITECTURE.md section 8.
const leadSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		phone: { type: String },
		mode: { type: String, enum: ["online", "in-person"], required: true },
		goal: { type: String },
		source: { type: String },
		// Admin triage: a new enquiry is "New" until an admin marks it "Handled".
		status: { type: String, enum: ["New", "Handled"], default: "New" },
		handledAt: { type: Date },
	},
	// The site only ever creates a lead, so record createdAt and drop updatedAt.
	{ timestamps: { createdAt: true, updatedAt: false } },
);

// InferSchemaType omits _id and the timestamp. Add createdAt, and expose a
// hydrated doc type so callers see _id and the document methods.
type TLeadFields = InferSchemaType<typeof leadSchema> & { createdAt: Date };
export type TLeadDoc = HydratedDocument<TLeadFields>;

// Reuse the compiled model across hot reloads; defining it twice throws.
export const Lead: Model<TLeadFields> = (models.Lead as Model<TLeadFields>) ?? model<TLeadFields>("Lead", leadSchema);
