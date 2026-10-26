import type { Metadata } from "next";
import AdminSettingsWrapper from "@/libs/AdminSettingsWrapper";

export const metadata: Metadata = {
	title: "Settings — Admin",
};

export default function AdminSettingsPage() {
	return <AdminSettingsWrapper />;
}
