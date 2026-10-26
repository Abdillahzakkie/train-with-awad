import type { ReactNode } from "react";
import { MainStyled, ShellStyled } from "./styled";

interface ISiteShellProps {
	// Header and Footer are passed as slots so the shell stays decoupled from
	// their props and the content that fills them.
	header?: ReactNode;
	footer?: ReactNode;
	children: ReactNode;
}

export default function SiteShell({ header, footer, children }: ISiteShellProps) {
	return (
		<ShellStyled>
			{header}
			<MainStyled>{children}</MainStyled>
			{footer}
		</ShellStyled>
	);
}
