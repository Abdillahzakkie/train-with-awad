import type { Metadata } from "next";
import SiteRenderer from "@/libs/SiteRenderer";
import { getEbooks, getPlans, getSiteContent, getTestimonials } from "@/server/data";

// Rendered per request so admin edits to content, order, and visibility show at
// once, and the build never needs the database.
export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
	const { pages } = await getSiteContent();
	const page = pages.home;
	const title = page?.metaTitle ?? "Train With Awad — strength coaching online and in Northampton";
	const description =
		page?.metaDescription ??
		"Get stronger on a plan that fits your life. Online and in-person strength coaching in Northampton, plus training and nutrition ebooks.";
	return {
		title: { absolute: title },
		description,
		openGraph: {
			title: "Train With Awad — strength coaching online and in Northampton",
			description: "Online and in-person strength coaching in Northampton, built around your life.",
		},
	};
}

// Organization JSON-LD for search (ARCHITECTURE.md §5).
const ORG_LD = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: "Train With Awad",
	description: "Online and in-person strength coaching in Northampton.",
	url: SITE_URL,
	areaServed: "Northampton",
};

export default async function HomePage() {
	const [{ pages }, plans, ebooks, testimonials] = await Promise.all([
		getSiteContent(),
		getPlans({ publishedOnly: true }),
		getEbooks({ publishedOnly: true }),
		getTestimonials({ publishedOnly: true }),
	]);
	const page = pages.home;
	if (!page) return null;

	return (
		<>
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is serialized from a trusted constant. */}
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_LD) }} />
			<SiteRenderer page={page} plans={plans} ebooks={ebooks} testimonials={testimonials} />
		</>
	);
}
