import AdminFaqWrapper from "@/libs/AdminFaqWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "FAQ — Admin",
};

export default function AdminFaqPage() {
	return <AdminFaqWrapper />;
}
