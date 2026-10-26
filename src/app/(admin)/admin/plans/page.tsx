import AdminPlansWrapper from "@/libs/AdminPlansWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Coaching plans — Admin",
};

export default function AdminPlansPage() {
	return <AdminPlansWrapper />;
}
