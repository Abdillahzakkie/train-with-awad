import SiteRenderer from "@/libs/SiteRenderer";
import { getSiteContent } from "@/server/data";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
	const { pages } = await getSiteContent();
	const page = pages.about;
	return {
		title: page?.metaTitle ?? "About",
		description:
			page?.metaDescription ??
			"Meet Awad, a Northampton strength coach with nine years taking lifters from first session to first competition, online and in person.",
		openGraph: {
			title: "About — Train With Awad",
			description:
				"Nine years coaching lifters in Northampton and online, from first session to first competition.",
		},
	};
}

export default async function AboutPage() {
	const { pages } = await getSiteContent();
	const page = pages.about;
	if (!page) return null;
	return <SiteRenderer page={page} />;
}
