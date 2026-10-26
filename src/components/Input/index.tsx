import type { ComponentPropsWithoutRef, ElementType } from "react";
import { InputStyled } from "./styled";

interface IInputProps extends ComponentPropsWithoutRef<"input"> {
	// A textarea for a longer answer such as the contact form's goal field.
	multiline?: boolean;
	// Render a native <select> (its own control chrome) or another element.
	as?: ElementType;
}

export default function Input({ multiline, as, children, ...rest }: IInputProps) {
	const element = as ?? (multiline ? "textarea" : "input");
	return (
		<InputStyled as={element} $area={multiline} {...rest}>
			{children}
		</InputStyled>
	);
}
