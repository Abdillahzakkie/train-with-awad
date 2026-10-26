import { z } from "zod";

// The checkout request body. The route looks the slug up in content/ebooks and
// returns 404 when it is unknown, so this only guards shape, not the catalogue.
export const checkoutSchema = z.object({
	slug: z.string().trim().min(1, "Choose an ebook"),
});

export type TCheckoutInput = z.infer<typeof checkoutSchema>;
