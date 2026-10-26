import type { ComponentPropsWithoutRef } from "react";
import { LabelStyled, ReqStyled } from "./styled";

interface ILabelProps extends ComponentPropsWithoutRef<"label"> {
	required?: boolean;
}

export default function Label({ required, children, ...rest }: ILabelProps) {
	return (
		<LabelStyled {...rest}>
			{children}
			{required && <ReqStyled aria-hidden="true">*</ReqStyled>}
		</LabelStyled>
	);
}
