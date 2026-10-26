"use client";

import { fetcher } from "@/constants";
import { AdminButton, AdminCard, AdminGrid, AdminNotice, PageHeader } from "@/libs/adminUi";
import useSWR from "swr";

interface ICounts {
	ebooks: number;
	testimonials: number;
	faq: number;
	plans: number;
	leads: number;
	orders: number;
}

const TILES: { key: keyof ICounts; label: string }[] = [
	{ key: "leads", label: "Enquiries" },
	{ key: "orders", label: "Orders" },
	{ key: "ebooks", label: "Ebooks" },
	{ key: "plans", label: "Coaching plans" },
	{ key: "testimonials", label: "Testimonials" },
	{ key: "faq", label: "FAQ" },
];

const LINKS: { href: string; label: string }[] = [
	{ href: "/admin/leads", label: "Enquiries" },
	{ href: "/admin/orders", label: "Orders" },
	{ href: "/admin/content", label: "Pages & text" },
	{ href: "/admin/ebooks", label: "Ebooks" },
	{ href: "/admin/plans", label: "Coaching plans" },
	{ href: "/admin/testimonials", label: "Testimonials" },
];

export default function AdminDashboardWrapper() {
	const { data, isLoading } = useSWR<{ counts: ICounts }>("/api/admin/overview", fetcher);
	const counts = data?.counts;

	return (
		<>
			<PageHeader title="Dashboard" subtitle="An overview of your site and a quick way into each section." />

			{isLoading ? (
				<AdminNotice tone="info">Loading your overview…</AdminNotice>
			) : (
				<AdminGrid $cols={3}>
					{TILES.map((tile) => (
						<AdminCard key={tile.key} title={counts ? String(counts[tile.key]) : "—"}>
							<p>{tile.label}</p>
						</AdminCard>
					))}
				</AdminGrid>
			)}

			<AdminCard title="Jump to a section">
				<AdminGrid $cols={3}>
					{LINKS.map((link) => (
						<AdminButton key={link.href} as="a" href={link.href} variant="secondary" block>
							{link.label}
						</AdminButton>
					))}
				</AdminGrid>
			</AdminCard>
		</>
	);
}
