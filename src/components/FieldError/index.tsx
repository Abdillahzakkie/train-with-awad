import type { ComponentPropsWithoutRef } from "react";
import { FieldErrorStyled } from "./styled";

type TFieldErrorProps = ComponentPropsWithoutRef<"span">;

export default function FieldError({ children, ...rest }: TFieldErrorProps) {
	// role="alert" so a screen reader announces the error when it appears.
	return (
		<FieldErrorStyled role="alert" {...rest}>
			{children}
		</FieldErrorStyled>
	);
}
