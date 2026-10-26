import type { ComponentPropsWithoutRef } from "react";
import { PriceStyled } from "./styled";

type TPriceProps = ComponentPropsWithoutRef<"span">;

export default function Price({ children, ...rest }: TPriceProps) {
	return <PriceStyled {...rest}>{children}</PriceStyled>;
}
