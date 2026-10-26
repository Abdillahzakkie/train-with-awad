import type { Metadata } from "next";
import AdminTeamWrapper from "@/libs/AdminTeamWrapper";

export const metadata: Metadata = {
	title: "Team & access — Admin",
};

export default function AdminTeamPage() {
	return <AdminTeamWrapper />;
}
