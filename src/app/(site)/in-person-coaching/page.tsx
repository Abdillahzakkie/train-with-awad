import SiteRenderer from "@/libs/SiteRenderer";
import { getSiteContent } from "@/server/data";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
	const { pages } = await getSiteContent();
	const page = pages["in-person-coaching"];
	return {
		title: page?.metaTitle ?? "In-person coaching",
		description:
			page?.metaDescription ??
			"One-to-one strength coaching at a private Northampton gym from £45 a session, with a plan for the days you train alone.",
		openGraph: {
			title: "In-person coaching — Train With Awad",
			description: "Hands-on technique coaching in Northampton, plus a plan for the days you train alone.",
		},
	};
}

export default async function InPersonCoachingPage() {
	const { pages } = await getSiteContent();
	const page = pages["in-person-coaching"];
	if (!page) return null;
	return <SiteRenderer page={page} />;
}
