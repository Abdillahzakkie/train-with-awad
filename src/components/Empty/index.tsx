import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { EmptyGlyphStyled, EmptyStyled, EmptyTitleStyled } from "./styled";

interface IEmptyProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
	title: ReactNode;
	description?: ReactNode;
	// The action that fills the empty state — pass a Button. Required by design:
	// an empty state names its action rather than reading "no data".
	children: ReactNode;
}

export default function Empty({ title, description, children, ...rest }: IEmptyProps) {
	return (
		<EmptyStyled {...rest}>
			<EmptyGlyphStyled aria-hidden="true">
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H5V5h14v10z" />
				</svg>
			</EmptyGlyphStyled>
			<EmptyTitleStyled>{title}</EmptyTitleStyled>
			{description && <p>{description}</p>}
			{children}
		</EmptyStyled>
	);
}
