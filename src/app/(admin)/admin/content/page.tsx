import AdminContentWrapper from "@/libs/AdminContentWrapper";
import { getSiteContent } from "@/server/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Site content — Admin",
	robots: { index: false },
};

// Reads the current content server-side and hands it to the editor, so the page
// opens filled. Edits save back through PUT /api/admin/content.
export default async function AdminContentPage() {
	const content = await getSiteContent();
	return <AdminContentWrapper initial={content} />;
}
