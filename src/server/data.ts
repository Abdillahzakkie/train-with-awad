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

// The public shape of each record: the content-module fields plus the stored id,
// order, and status. Mongoose 9's lean() types the DB branch as a union TS can't
// narrow, so each getter casts its cleaned docs to these (the runtime shape is
// identical — clean() strips _id/__v/timestamps, leaving exactly these fields).
type Status = "Draft" | "Published";
export type PublicEbook = (typeof EBOOKS)[number] & { id: string; order: number; status: Status };
export type PublicTestimonial = (typeof TESTIMONIALS)[number] & { id: string; order: number; status: Status };
export type PublicFaq = (typeof FAQS)[number] & { id: string; order: number; status: Status };
export type PublicPlan = (typeof PLANS)[number] & { id: string; order: number; status: Status; featured: boolean };

/** The editable page copy, falling back to DEFAULT_SITE_CONTENT when none is stored. */
export async function getSiteContent(): Promise<SiteContentData> {
	await connectToDatabase();
	const doc = await SiteContent.findOne({ key: "site" }).lean();
	return (doc?.data as SiteContentData) ?? DEFAULT_SITE_CONTENT;
}

export async function getEbooks(opts: ListOpts = {}): Promise<PublicEbook[]> {
	await connectToDatabase();
	const q = opts.publishedOnly ? { status: "Published" as const } : {};
	const docs = await Ebook.find(q).sort({ order: 1, createdAt: -1 }).lean();
	if (docs.length > 0) {
		return docs.map(clean) as unknown as PublicEbook[];
	}
	// Empty collection: render the content seed so the public site works pre-seed.
	return EBOOKS.map((e, i) => ({ id: e.slug, ...e, order: i, status: "Published" as const }));
}

export async function getTestimonials(opts: ListOpts = {}): Promise<PublicTestimonial[]> {
	await connectToDatabase();
	const q = opts.publishedOnly ? { status: "Published" as const } : {};
	const docs = await Testimonial.find(q).sort({ order: 1, createdAt: -1 }).lean();
	if (docs.length > 0) {
		return docs.map(clean) as unknown as PublicTestimonial[];
	}
	return TESTIMONIALS.map((t, i) => ({ id: String(i), ...t, order: i, status: "Published" as const }));
}

export async function getFaqs(opts: ListOpts = {}): Promise<PublicFaq[]> {
	await connectToDatabase();
	const q = opts.publishedOnly ? { status: "Published" as const } : {};
	const docs = await Faq.find(q).sort({ order: 1, createdAt: -1 }).lean();
	if (docs.length > 0) {
		return docs.map(clean) as unknown as PublicFaq[];
	}
	return FAQS.map((f, i) => ({ id: String(i), ...f, order: i, status: "Published" as const }));
}

export async function getPlans(opts: ListOpts = {}): Promise<PublicPlan[]> {
	await connectToDatabase();
	const q = opts.publishedOnly ? { status: "Published" as const } : {};
	const docs = await Plan.find(q).sort({ order: 1, createdAt: -1 }).lean();
	if (docs.length > 0) {
		return docs.map(clean) as unknown as PublicPlan[];
	}
	return PLANS.map((p, i) => ({
		id: String(i),
		...p,
		featured: p.featured ?? false,
		order: i,
		status: "Published" as const,
	}));
}
