import type { ComponentPropsWithoutRef } from "react";
import { FieldStyled } from "./styled";

interface IFieldProps extends ComponentPropsWithoutRef<"div"> {
	invalid?: boolean;
}

export default function Field({ invalid, children, ...rest }: IFieldProps) {
	return (
		<FieldStyled $invalid={invalid} {...rest}>
			{children}
		</FieldStyled>
	);
}
