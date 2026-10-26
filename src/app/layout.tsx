import StyledComponentsRegistry from "@/components/StyledComponentsRegistry";
import { GlobalStyle, TW_BG } from "@/styles";
import type { Metadata, Viewport } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: "Train With Awad — strength coaching online and in Northampton",
		template: "%s — Train With Awad",
	},
	description:
		"Get stronger on a plan that fits your life. Online and in-person strength coaching with Awad, plus training and nutrition ebooks.",
	openGraph: {
		type: "website",
		siteName: "Train With Awad",
		url: SITE_URL,
	},
};

export const viewport: Viewport = {
	themeColor: TW_BG,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<StyledComponentsRegistry>
					<GlobalStyle />
					{children}
				</StyledComponentsRegistry>
			</body>
		</html>
	);
}
