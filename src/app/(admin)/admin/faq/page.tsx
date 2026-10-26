import type { Metadata } from "next";
import AdminFaqWrapper from "@/libs/AdminFaqWrapper";

export const metadata: Metadata = {
	title: "FAQ — Admin",
};

export default function AdminFaqPage() {
	return <AdminFaqWrapper />;
}
