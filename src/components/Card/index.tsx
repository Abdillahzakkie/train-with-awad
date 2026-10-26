import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { CardIconStyled, CardStyled } from "./styled";

interface ICardProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
	// Render a decorative icon plate above the content.
	icon?: boolean;
	title?: ReactNode;
	// Render as another element — a <form> for the contact card.
	as?: ElementType;
}

export default function Card({ icon, title, as, children, ...rest }: ICardProps) {
	return (
		<CardStyled as={as} {...rest}>
			{icon && <CardIconStyled aria-hidden="true" />}
			{title && <h5>{title}</h5>}
			{children}
		</CardStyled>
	);
}
