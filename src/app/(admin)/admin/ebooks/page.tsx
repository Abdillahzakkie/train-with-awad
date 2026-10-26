import AdminEbooksWrapper from "@/libs/AdminEbooksWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Ebooks — Admin",
};

export default function AdminEbooksPage() {
	return <AdminEbooksWrapper />;
}
