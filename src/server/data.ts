import "server-only";
import { EBOOKS, FAQS, PLANS, TESTIMONIALS } from "@/content";
import { DEFAULT_SITE_CONTENT } from "@/content/defaults";
import type { SiteContentData } from "@/types";
import { connectToDatabase } from "./db/connect";
import { Ebook } from "./models/Ebook";
import { Faq } from "./models/Faq";
import { Plan } from "./models/Plan";
import { SiteContent } from "./models/SiteContent";
import { Testimonial } from "./models/Testimonial";

// Plain, serializable objects for React Server Components: Mongo _id -> id, with
// no __v or Mongoose timestamp internals.
// biome-ignore lint/suspicious/noExplicitAny: lean() returns loosely-typed docs.
function clean<T extends Record<string, any>>(doc: T) {
	const { _id, __v, createdAt, updatedAt, ...rest } = doc;
	return { id: String(_id), ...rest };
}

interface ListOpts {
	publishedOnly?: boolean;
}

/** The editable page copy, falling back to DEFAULT_SITE_CONTENT when none is stored. */
export async function getSiteContent(): Promise<SiteContentData> {
	await connectToDatabase();
	const doc = await SiteContent.findOne({ key: "site" }).lean();
	return (doc?.data as SiteContentData) ?? DEFAULT_SITE_CONTENT;
}

export async function getEbooks(opts: ListOpts = {}) {
	await connectToDatabase();
	const q = opts.publishedOnly ? { status: "Published" } : {};
	const docs = await Ebook.find(q).sort({ order: 1, createdAt: -1 }).lean();
	if (docs.length > 0) {
		return docs.map(clean);
	}
	// Empty collection: render the content seed so the public site works pre-seed.
	return EBOOKS.map((e, i) => ({ id: e.slug, ...e, order: i, status: "Published" as const }));
}

export async function getTestimonials(opts: ListOpts = {}) {
	await connectToDatabase();
	const q = opts.publishedOnly ? { status: "Published" } : {};
	const docs = await Testimonial.find(q).sort({ order: 1, createdAt: -1 }).lean();
	if (docs.length > 0) {
		return docs.map(clean);
	}
	return TESTIMONIALS.map((t, i) => ({ id: String(i), ...t, order: i, status: "Published" as const }));
}

export async function getFaqs(opts: ListOpts = {}) {
	await connectToDatabase();
	const q = opts.publishedOnly ? { status: "Published" } : {};
	const docs = await Faq.find(q).sort({ order: 1, createdAt: -1 }).lean();
	if (docs.length > 0) {
		return docs.map(clean);
	}
	return FAQS.map((f, i) => ({ id: String(i), ...f, order: i, status: "Published" as const }));
}

export async function getPlans(opts: ListOpts = {}) {
	await connectToDatabase();
	const q = opts.publishedOnly ? { status: "Published" } : {};
	const docs = await Plan.find(q).sort({ order: 1, createdAt: -1 }).lean();
	if (docs.length > 0) {
		return docs.map(clean);
	}
	return PLANS.map((p, i) => ({
		id: String(i),
		...p,
		featured: p.featured ?? false,
		order: i,
		status: "Published" as const,
	}));
}

export type PublicEbook = Awaited<ReturnType<typeof getEbooks>>[number];
export type PublicTestimonial = Awaited<ReturnType<typeof getTestimonials>>[number];
export type PublicFaq = Awaited<ReturnType<typeof getFaqs>>[number];
export type PublicPlan = Awaited<ReturnType<typeof getPlans>>[number];
