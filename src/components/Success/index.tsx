import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { SuccessCheckStyled, SuccessStyled } from "./styled";

interface ISuccessProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
	title: ReactNode;
	description?: ReactNode;
	// Optional next step — a secondary Button or link.
	children?: ReactNode;
}

export default function Success({ title, description, children, ...rest }: ISuccessProps) {
	return (
		<SuccessStyled {...rest}>
			<SuccessCheckStyled aria-hidden="true">✓</SuccessCheckStyled>
			<h4>{title}</h4>
			{description && <p>{description}</p>}
			{children}
		</SuccessStyled>
	);
}
