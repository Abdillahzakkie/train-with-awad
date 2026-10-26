import type { Metadata } from "next";
import AdminDashboardWrapper from "@/libs/AdminDashboardWrapper";

export const metadata: Metadata = {
	title: "Dashboard — Admin",
};

export default function AdminDashboardPage() {
	return <AdminDashboardWrapper />;
}
