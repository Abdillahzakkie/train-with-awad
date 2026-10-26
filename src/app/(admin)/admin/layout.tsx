import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSession } from "@/server/auth";
import { connectToDatabase } from "@/server/db/connect";
import { getEffectivePermissions } from "@/server/iam";
import { AdminUser } from "@/server/models/AdminUser";
import { getSettings } from "@/server/services/settings";
import AdminShell from "./_shell";

// The authed area reads the session per request. The middleware already gates
// /admin, but the layout re-checks so a server render never leaks without one.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
	const session = await getSession();
	if (!session) redirect("/signin");

	const perms = await getEffectivePermissions(session.sub);
	await connectToDatabase();
	const record = await AdminUser.findById(session.sub).lean();
	const user = {
		name: (record as { name?: string } | null)?.name ?? "Admin",
		email: session.email,
	};
	const { logoUrl } = await getSettings();

	return (
		<AdminShell user={user} perms={perms} logoUrl={logoUrl}>
			{children}
		</AdminShell>
	);
}
