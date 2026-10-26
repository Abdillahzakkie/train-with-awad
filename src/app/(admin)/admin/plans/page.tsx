import type { Metadata } from "next";
import AdminPlansWrapper from "@/libs/AdminPlansWrapper";

export const metadata: Metadata = {
	title: "Coaching plans — Admin",
};

export default function AdminPlansPage() {
	return <AdminPlansWrapper />;
}
