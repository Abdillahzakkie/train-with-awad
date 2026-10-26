import { AdminGlobalStyle } from "@/libs/adminTheme";
import type { ReactNode } from "react";

// The admin route group renders light and spacious, overriding the public dark
// theme. AdminGlobalStyle paints the whole surface; it covers both /signin and
// the authed /admin area.
export default function AdminGroupLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<AdminGlobalStyle />
			{children}
		</>
	);
}
