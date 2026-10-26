import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Allow crawling of the public pages; keep the API and post-purchase pages out.
export default function robots(): MetadataRoute.Robots {
	return {
		rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/order"] },
		sitemap: `${SITE_URL}/sitemap.xml`,
	};
}
