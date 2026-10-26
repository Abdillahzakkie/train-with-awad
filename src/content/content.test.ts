import { describe, expect, it } from "vitest";
import { EBOOKS, FAQS, PLANS, TESTIMONIALS } from "@/content";

describe("content modules", () => {
	it("ships the three fixed ebooks with unique slugs and numeric prices", () => {
		expect(EBOOKS).toHaveLength(3);
		const slugs = EBOOKS.map((ebook) => ebook.slug);
		expect(new Set(slugs)).toEqual(new Set(["strength-foundations", "eat-to-perform", "train-anywhere"]));
		for (const ebook of EBOOKS) {
			expect(typeof ebook.priceGBP).toBe("number");
			expect(ebook.priceGBP).toBeGreaterThan(0);
			expect(ebook.stripePriceId).toMatch(/^price_/);
			expect(ebook.cover).toMatch(/^\/ebooks\//);
		}
	});

	it("keeps the fixed prices", () => {
		const bySlug = Object.fromEntries(EBOOKS.map((ebook) => [ebook.slug, ebook.priceGBP]));
		expect(bySlug["strength-foundations"]).toBe(9.99);
		expect(bySlug["eat-to-perform"]).toBe(7.99);
		expect(bySlug["train-anywhere"]).toBe(8.99);
	});

	it("has non-empty testimonials, FAQs, and plans", () => {
		expect(TESTIMONIALS.length).toBeGreaterThan(0);
		expect(FAQS.length).toBeGreaterThan(0);
		expect(PLANS.length).toBe(3);
		for (const testimonial of TESTIMONIALS) {
			expect(testimonial.quote.trim().length).toBeGreaterThan(0);
		}
	});
});
