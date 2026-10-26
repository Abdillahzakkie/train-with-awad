"use client";
import type { TPermissions } from "@/constants/iam";
import { ADMIN_SECTIONS, AdminRail } from "@/layouts";
import { AdminInnerStyled, AdminMainStyled } from "@/libs/adminUi/styled";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// The authed admin frame: the sidebar beside the page. A thin client wrapper so
// the sidebar can read the current path to highlight the active section; the
// server layout supplies the user and permissions.
export default function AdminShell({
	user,
	perms,
	children,
}: {
	user: { name: string; email: string };
	perms: TPermissions;
	children: ReactNode;
}) {
	const pathname = usePathname();
	return (
		<div style={{ display: "flex", minHeight: "100vh", alignItems: "stretch" }}>
			<AdminRail items={ADMIN_SECTIONS} activeHref={pathname} user={user} perms={perms} />
			<AdminMainStyled>
				<AdminInnerStyled>{children}</AdminInnerStyled>
			</AdminMainStyled>
		</div>
	);
}
