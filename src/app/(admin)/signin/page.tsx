import type { Metadata } from "next";
import AdminSignInWrapper from "@/libs/AdminSignInWrapper";
import { AdminGlobalStyle } from "@/libs/adminTheme";
import { getSettings } from "@/server/services/settings";

export const metadata: Metadata = {
	title: "Sign in — Admin",
};

export default async function SignInPage() {
	const { logoUrl } = await getSettings();
	return (
		<>
			<AdminGlobalStyle />
			<AdminSignInWrapper logoUrl={logoUrl} />
		</>
	);
}
