import AdminMediaWrapper from "@/libs/AdminMediaWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Media — Admin",
};

export default function AdminMediaPage() {
	return <AdminMediaWrapper />;
}
