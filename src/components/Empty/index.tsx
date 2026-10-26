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
			<EmptyGlyphStyled aria-hidden="true" />
			<EmptyTitleStyled>{title}</EmptyTitleStyled>
			{description && <p>{description}</p>}
			{children}
		</EmptyStyled>
	);
}
