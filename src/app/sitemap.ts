import type { MetadataRoute } from "next";
import { EBOOKS } from "@/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Built from the content modules and ebook slugs, so adding an ebook flows
// through to the sitemap without a second edit. Post-purchase pages (/order)
// stay out — they are not content to index.
export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date();
	const staticPaths = [
		"",
		"/about",
		"/online-coaching",
		"/in-person-coaching",
		"/ebooks",
		"/testimonials",
		"/faq",
		"/contact",
		"/legal",
	];

	return [
		...staticPaths.map((path) => ({ url: `${SITE_URL}${path}`, lastModified })),
		...EBOOKS.map((ebook) => ({ url: `${SITE_URL}/ebooks/${ebook.slug}`, lastModified })),
	];
}
