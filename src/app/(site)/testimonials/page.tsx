import type { Metadata } from "next";
import SiteRenderer from "@/libs/SiteRenderer";
import { getSiteContent, getTestimonials } from "@/server/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
	const { pages } = await getSiteContent();
	const page = pages.testimonials;
	return {
		title: page?.metaTitle ?? "Testimonials",
		description:
			page?.metaDescription ??
			"What training with Awad is like, in lifters' own words — the strong weeks and the honest ones.",
		openGraph: {
			title: "Testimonials — Train With Awad",
			description: "Lifters on coaching with Awad, online and in Northampton.",
		},
	};
}

export default async function TestimonialsPage() {
	const [{ pages }, testimonials] = await Promise.all([getSiteContent(), getTestimonials({ publishedOnly: true })]);
	const page = pages.testimonials;
	if (!page) return null;
	return <SiteRenderer page={page} testimonials={testimonials} />;
}
