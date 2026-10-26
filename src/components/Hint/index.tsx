import type { ComponentPropsWithoutRef } from "react";
import { HintStyled } from "./styled";

type THintProps = ComponentPropsWithoutRef<"span">;

export default function Hint({ children, ...rest }: THintProps) {
	return <HintStyled {...rest}>{children}</HintStyled>;
}
