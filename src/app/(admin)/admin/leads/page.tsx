import AdminLeadsWrapper from "@/libs/AdminLeadsWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Enquiries — Admin",
};

export default function AdminLeadsPage() {
	return <AdminLeadsWrapper />;
}
