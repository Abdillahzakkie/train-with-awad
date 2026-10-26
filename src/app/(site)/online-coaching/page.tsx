import type { Metadata } from "next";
import SiteRenderer from "@/libs/SiteRenderer";
import { getSiteContent } from "@/server/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
	const { pages } = await getSiteContent();
	const page = pages["online-coaching"];
	return {
		title: page?.metaTitle ?? "Online coaching",
		description:
			page?.metaDescription ??
			"Online strength coaching from £120 a month: a plan built for you, form reviewed within a day, and a weekly check-in. Book a free call.",
		openGraph: {
			title: "Online coaching — Train With Awad",
			description: "A coached plan that travels with you — programming, weekly form review, and check-ins.",
		},
	};
}

export default async function OnlineCoachingPage() {
	const { pages } = await getSiteContent();
	const page = pages["online-coaching"];
	if (!page) return null;
	return <SiteRenderer page={page} />;
}
