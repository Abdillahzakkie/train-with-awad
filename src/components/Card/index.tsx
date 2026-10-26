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
			{icon && (
				<CardIconStyled aria-hidden="true">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
					</svg>
				</CardIconStyled>
			)}
			{title && <h5>{title}</h5>}
			{children}
		</CardStyled>
	);
}
