"use client";
import { useServerInsertedHTML } from "next/navigation";
import { type ReactNode, useState } from "react";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

// Collects styled-components' styles during the server render and flushes them
// into the streamed HTML, so the first paint is styled. The portfolio pattern.
export default function StyledComponentsRegistry({ children }: { children: ReactNode }) {
	const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

	useServerInsertedHTML(() => {
		const styles = styledComponentsStyleSheet.getStyleElement();
		styledComponentsStyleSheet.instance.clearTag();
		return <>{styles}</>;
	});

	if (typeof window !== "undefined") return <>{children}</>;

	return (
		<StyleSheetManager sheet={styledComponentsStyleSheet.instance}>{children}</StyleSheetManager>
	);
}
