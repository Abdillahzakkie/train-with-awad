import AdminDashboardWrapper from "@/libs/AdminDashboardWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dashboard — Admin",
};

export default function AdminDashboardPage() {
	return <AdminDashboardWrapper />;
}
