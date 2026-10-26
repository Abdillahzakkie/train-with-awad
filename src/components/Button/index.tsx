import type { ComponentPropsWithoutRef, ElementType } from "react";
import { ButtonStyled, type TButtonSize, type TButtonVariant } from "./styled";

interface IButtonProps extends ComponentPropsWithoutRef<"button"> {
	variant?: TButtonVariant;
	size?: TButtonSize;
	block?: boolean;
	// Render as another element — an anchor for the "Book a free call" CTA.
	as?: ElementType;
	href?: string;
}

export default function Button({ variant = "secondary", size = "md", block, type, as, ...rest }: IButtonProps) {
	return (
		<ButtonStyled
			as={as}
			$variant={variant}
			$size={size}
			$block={block}
			type={as ? undefined : (type ?? "button")}
			{...rest}
		/>
	);
}

export type { TButtonSize, TButtonVariant };
