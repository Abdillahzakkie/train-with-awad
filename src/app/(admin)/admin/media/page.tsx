import type { Metadata } from "next";
import AdminMediaWrapper from "@/libs/AdminMediaWrapper";

export const metadata: Metadata = {
	title: "Media — Admin",
};

export default function AdminMediaPage() {
	return <AdminMediaWrapper />;
}
