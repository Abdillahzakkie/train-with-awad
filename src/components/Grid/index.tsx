import type { ComponentPropsWithoutRef } from "react";
import { GridStyled } from "./styled";

interface IGridProps extends ComponentPropsWithoutRef<"div"> {
	// Columns from tablet up; one column on mobile. Transient so it never reaches
	// the DOM.
	$cols: 2 | 3 | 4;
}

export default function Grid({ $cols, children, ...rest }: IGridProps) {
	return (
		<GridStyled $cols={$cols} {...rest}>
			{children}
		</GridStyled>
	);
}
