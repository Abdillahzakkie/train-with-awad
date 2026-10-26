"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
	FiBook,
	FiClipboard,
	FiFileText,
	FiHelpCircle,
	FiImage,
	FiInbox,
	FiLogOut,
	FiSettings,
	FiShoppingBag,
	FiStar,
	FiUsers,
} from "react-icons/fi";
import { can, type TPermissions, type TResource } from "@/constants/iam";
import { RailStyled } from "./styled";

export interface IAdminNavItem {
	href: string;
	label: string;
	icon?: ReactNode;
	resource: TResource;
}

// Friendly, plain-language labels and icons for every admin section. The admin
// layout passes these to AdminRail; kept here so the rail owns no copy of its
// own and the layout has one source to build from.
export const ADMIN_SECTIONS: IAdminNavItem[] = [
	{ href: "/admin/content", label: "Pages & text", icon: <FiFileText />, resource: "content" },
	{ href: "/admin/ebooks", label: "Ebooks", icon: <FiBook />, resource: "ebooks" },
	{ href: "/admin/testimonials", label: "Testimonials", icon: <FiStar />, resource: "testimonials" },
	{ href: "/admin/faq", label: "FAQ", icon: <FiHelpCircle />, resource: "faq" },
	{ href: "/admin/plans", label: "Coaching plans", icon: <FiClipboard />, resource: "plans" },
	{ href: "/admin/leads", label: "Enquiries", icon: <FiInbox />, resource: "leads" },
	{ href: "/admin/orders", label: "Orders", icon: <FiShoppingBag />, resource: "orders" },
	{ href: "/admin/media", label: "Images", icon: <FiImage />, resource: "media" },
	{ href: "/admin/settings", label: "Settings", icon: <FiSettings />, resource: "settings" },
	{ href: "/admin/team", label: "Team & access", icon: <FiUsers />, resource: "team" },
];

function initials(name: string, email: string) {
	const source = name || email;
	return (
		source
			.split(/[\s@.]+/)
			.map((part) => part[0])
			.filter(Boolean)
			.slice(0, 2)
			.join("")
			.toUpperCase() || "ME"
	);
}

interface IAdminRailProps {
	items: IAdminNavItem[];
	activeHref: string;
	user: { name: string; email: string };
	perms: TPermissions;
	// Defaults to a logout request plus a hard redirect; the layout may override.
	onSignOut?: () => void;
}

export default function AdminRail({ items, activeHref, user, perms, onSignOut }: IAdminRailProps) {
	// Hide any section the signed-in person cannot read. The server enforces
	// access regardless; this keeps the rail honest about what they can open.
	const visible = items.filter((item) => can(perms, item.resource, "read"));

	const signOut =
		onSignOut ??
		(async () => {
			await fetch("/api/auth/logout", { method: "POST" });
			// Hard reload so no cached admin state survives the sign-out.
			window.location.href = "/signin";
		});

	return (
		<RailStyled aria-label="Admin sections">
			<div className="brand">
				<span className="wm" aria-hidden="true" />
				<span className="label">Train With Awad</span>
			</div>

			{visible.map((item) => {
				const on = activeHref === item.href || activeHref.startsWith(`${item.href}/`);
				return (
					<Link
						key={item.href}
						href={item.href}
						className="rentry"
						data-on={on}
						aria-current={on ? "page" : undefined}
					>
						<span className="ic" aria-hidden="true">
							{item.icon}
						</span>
						<span className="label">{item.label}</span>
					</Link>
				);
			})}

			<div className="spacer" />

			<div className="ruser">
				<span className="av" aria-hidden="true">
					{initials(user.name, user.email)}
				</span>
				<span className="who">
					<span className="name">{user.name || user.email}</span>
					{user.name && <span className="email">{user.email}</span>}
				</span>
			</div>
			<button type="button" className="signout" onClick={signOut}>
				<span className="ic" aria-hidden="true">
					<FiLogOut />
				</span>
				<span className="label">Sign out</span>
			</button>
		</RailStyled>
	);
}
