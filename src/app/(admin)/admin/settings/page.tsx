import AdminSettingsWrapper from "@/libs/AdminSettingsWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Settings — Admin",
};

export default function AdminSettingsPage() {
	return <AdminSettingsWrapper />;
}
