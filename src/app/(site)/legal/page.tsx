import type { Metadata } from "next";
import SiteRenderer from "@/libs/SiteRenderer";
import { getSiteContent } from "@/server/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
	const { pages } = await getSiteContent();
	const page = pages.legal;
	return {
		title: page?.metaTitle ?? "Privacy & terms",
		description:
			page?.metaDescription ??
			"How Train With Awad collects, uses, and protects your details, and what you can ask for.",
		openGraph: {
			title: "Privacy & terms — Train With Awad",
			description: "What Train With Awad collects, why, how long it is kept, and the choices you have.",
		},
	};
}

export default async function LegalPage() {
	const { pages } = await getSiteContent();
	const page = pages.legal;
	if (!page) return null;
	return <SiteRenderer page={page} />;
}
