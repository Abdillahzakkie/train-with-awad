"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { TPermissions } from "@/constants/iam";
import { ADMIN_SECTIONS, AdminRail } from "@/layouts";
import { AdminInnerStyled, AdminMainStyled, AdminShellStyled } from "@/libs/adminUi/styled";

// The authed admin frame: the sidebar beside the page. A thin client wrapper so
// the sidebar can read the current path to highlight the active section; the
// server layout supplies the user and permissions.
export default function AdminShell({
	user,
	perms,
	logoUrl,
	children,
}: {
	user: { name: string; email: string };
	perms: TPermissions;
	logoUrl: string;
	children: ReactNode;
}) {
	const pathname = usePathname();
	return (
		<AdminShellStyled>
			<AdminRail items={ADMIN_SECTIONS} activeHref={pathname} user={user} perms={perms} logoUrl={logoUrl} />
			<AdminMainStyled>
				<AdminInnerStyled>{children}</AdminInnerStyled>
			</AdminMainStyled>
		</AdminShellStyled>
	);
}
