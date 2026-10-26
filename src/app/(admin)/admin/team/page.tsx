import AdminTeamWrapper from "@/libs/AdminTeamWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Team & access — Admin",
};

export default function AdminTeamPage() {
	return <AdminTeamWrapper />;
}
