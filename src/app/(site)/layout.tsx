import type { ReactNode } from "react";
import { Footer, Header, type IFooterColumn, type INavItem, SiteShell } from "@/layouts";
import { getSettings } from "@/server/services/settings";

// The nav set, CTA, and footer columns live here, in the route-group layout, so
// the kit layouts stay content-free. Legal sits in the footer, not the top nav.
const NAV: INavItem[] = [
	{ href: "/", label: "Home" },
	{ href: "/about", label: "About" },
	{ href: "/online-coaching", label: "Online coaching" },
	{ href: "/in-person-coaching", label: "In-person coaching" },
	{ href: "/ebooks", label: "Ebooks" },
	{ href: "/faq", label: "FAQ" },
	{ href: "/contact", label: "Contact" },
];

const CTA: INavItem = { href: "/contact", label: "Book a free call" };

const FOOTER_COLUMNS: IFooterColumn[] = [
	{
		heading: "Explore",
		links: [
			{ href: "/about", label: "About" },
			{ href: "/online-coaching", label: "Online coaching" },
			{ href: "/in-person-coaching", label: "In-person coaching" },
			{ href: "/testimonials", label: "Testimonials" },
			{ href: "/faq", label: "FAQ" },
		],
	},
	{
		heading: "Start",
		links: [
			{ href: "/contact", label: "Book a free call" },
			{ href: "/ebooks", label: "Browse the ebooks" },
		],
	},
	{
		heading: "Legal",
		links: [{ href: "/legal", label: "Privacy & terms" }],
	},
];

export default async function SiteLayout({ children }: { children: ReactNode }) {
	const { logoUrl } = await getSettings();
	return (
		<SiteShell
			header={<Header logoUrl={logoUrl} items={NAV} cta={CTA} />}
			footer={
				<Footer
					brand="Train With Awad"
					tagline="Strength coaching · Northampton & online"
					columns={FOOTER_COLUMNS}
				/>
			}
		>
			{children}
		</SiteShell>
	);
}
