import AdminOrdersWrapper from "@/libs/AdminOrdersWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Orders — Admin",
};

export default function AdminOrdersPage() {
	return <AdminOrdersWrapper />;
}
