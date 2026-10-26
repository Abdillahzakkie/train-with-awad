import { z } from "zod";

// The contact form request body. The client form imports this same schema for
// inline validation, so one definition guards both sides.
export const leadSchema = z.object({
	name: z.string().trim().min(1, "Enter your name").max(120),
	email: z.string().trim().email("Enter a valid email address"),
	phone: z.string().trim().max(40).optional(),
	mode: z.enum(["online", "in-person"], { message: "Choose online or in-person coaching" }),
	goal: z.string().trim().max(2000).optional(),
	source: z.string().trim().max(200).optional(),
});

export type TLeadInput = z.infer<typeof leadSchema>;
