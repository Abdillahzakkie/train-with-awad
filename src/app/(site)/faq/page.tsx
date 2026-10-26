import type { Metadata } from "next";
import SiteRenderer from "@/libs/SiteRenderer";
import { getFaqs, getSiteContent } from "@/server/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
	const { pages } = await getSiteContent();
	const page = pages.faq;
	return {
		title: page?.metaTitle ?? "FAQ",
		description:
			page?.metaDescription ??
			"Answers to common questions about online and in-person strength coaching with Awad — how it works, cost, and cancelling — before you book a free call.",
		openGraph: {
			title: "FAQ — Train With Awad",
			description: "How coaching with Awad works, what it costs, and how to cancel, before you book a free call.",
		},
	};
}

export default async function FaqPage() {
	const [{ pages }, faqs] = await Promise.all([getSiteContent(), getFaqs({ publishedOnly: true })]);
	const page = pages.faq;
	if (!page) return null;
	return <SiteRenderer page={page} faqs={faqs} />;
}
