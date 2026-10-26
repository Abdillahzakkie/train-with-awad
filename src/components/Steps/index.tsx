import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { StepsStyled } from "./styled";

interface IStepsProps extends ComponentPropsWithoutRef<"div"> {
	// How many columns from tablet up. The "how it works" row uses three.
	columns?: number;
	children: ReactNode;
}

export default function Steps({ columns = 3, children, ...rest }: IStepsProps) {
	return (
		<StepsStyled $cols={columns} {...rest}>
			{children}
		</StepsStyled>
	);
}
