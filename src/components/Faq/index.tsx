import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { FaqStyled } from "./styled";

interface IFaqProps extends ComponentPropsWithoutRef<"div"> {
	children: ReactNode;
}

export default function Faq({ children, ...rest }: IFaqProps) {
	return <FaqStyled {...rest}>{children}</FaqStyled>;
}
