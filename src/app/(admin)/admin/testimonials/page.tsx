import type { Metadata } from "next";
import AdminTestimonialsWrapper from "@/libs/AdminTestimonialsWrapper";

export const metadata: Metadata = {
	title: "Testimonials — Admin",
};

export default function AdminTestimonialsPage() {
	return <AdminTestimonialsWrapper />;
}
