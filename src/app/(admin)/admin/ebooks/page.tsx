import type { Metadata } from "next";
import AdminEbooksWrapper from "@/libs/AdminEbooksWrapper";

export const metadata: Metadata = {
	title: "Ebooks — Admin",
};

export default function AdminEbooksPage() {
	return <AdminEbooksWrapper />;
}
