import type { Metadata } from "next";
import AdminLeadsWrapper from "@/libs/AdminLeadsWrapper";

export const metadata: Metadata = {
	title: "Enquiries — Admin",
};

export default function AdminLeadsPage() {
	return <AdminLeadsWrapper />;
}
