import SiteRenderer from "@/libs/SiteRenderer";
import { getSiteContent } from "@/server/data";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
	const { pages } = await getSiteContent();
	const page = pages.contact;
	return {
		title: page?.metaTitle ?? "Book a free call — Train With Awad",
		description:
			page?.metaDescription ?? "Book a free 20-minute call with Awad to talk through your goals. No obligation.",
	};
}

export default async function ContactPage() {
	const { pages } = await getSiteContent();
	const page = pages.contact;
	if (!page) return null;
	return <SiteRenderer page={page} />;
}
