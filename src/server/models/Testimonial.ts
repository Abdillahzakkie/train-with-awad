import mongoose, { type HydratedDocument, type InferSchemaType, type Model, model, Schema } from "mongoose";

// A client testimonial, editable in the admin. Mirrors content/testimonials
// plus the `order`/`status` fields every admin-managed collection carries.
const testimonialSchema = new Schema(
	{
		name: { type: String, required: true },
		quote: { type: String, required: true },
		detail: { type: String, default: "" },
		rating: { type: Number },
		order: { type: Number, default: 0 },
		status: { type: String, enum: ["Published", "Draft"], default: "Published" },
	},
	{ timestamps: true },
);

type TTestimonialFields = InferSchemaType<typeof testimonialSchema> & { createdAt: Date };
export type TTestimonialDoc = HydratedDocument<TTestimonialFields>;

// Reuse the compiled model across hot reloads; defining it twice throws.
export const Testimonial: Model<TTestimonialFields> =
	(mongoose.models.Testimonial as Model<TTestimonialFields>) ??
	model<TTestimonialFields>("Testimonial", testimonialSchema);
