import AdminTestimonialsWrapper from "@/libs/AdminTestimonialsWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Testimonials — Admin",
};

export default function AdminTestimonialsPage() {
	return <AdminTestimonialsWrapper />;
}
