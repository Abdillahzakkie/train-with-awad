import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { PlansStyled } from "./styled";

interface IPlansProps extends ComponentPropsWithoutRef<"div"> {
	children: ReactNode;
}

export default function Plans({ children, ...rest }: IPlansProps) {
	return <PlansStyled {...rest}>{children}</PlansStyled>;
}
