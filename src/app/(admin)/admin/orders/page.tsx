import type { Metadata } from "next";
import AdminOrdersWrapper from "@/libs/AdminOrdersWrapper";

export const metadata: Metadata = {
	title: "Orders — Admin",
};

export default function AdminOrdersPage() {
	return <AdminOrdersWrapper />;
}
