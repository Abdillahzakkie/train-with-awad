import type { ComponentPropsWithoutRef } from "react";
import { StatusStyled, type TStatusTone } from "./styled";

interface IStatusProps extends ComponentPropsWithoutRef<"span"> {
	tone: TStatusTone;
}

export default function Status({ tone, children, ...rest }: IStatusProps) {
	return (
		<StatusStyled $tone={tone} {...rest}>
			{children}
		</StatusStyled>
	);
}

export type { TStatusTone };
