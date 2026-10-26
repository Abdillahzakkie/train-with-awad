import type { Metadata } from "next";
import AdminSignInWrapper from "@/libs/AdminSignInWrapper";
import { AdminGlobalStyle } from "@/libs/adminTheme";

export const metadata: Metadata = {
	title: "Sign in — Admin",
};

export default function SignInPage() {
	return (
		<>
			<AdminGlobalStyle />
			<AdminSignInWrapper />
		</>
	);
}
