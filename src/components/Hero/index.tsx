import type { ComponentPropsWithoutRef, ReactNode } from "react";
import {
	EyebrowStyled,
	HeroActionsStyled,
	HeroBandStyled,
	HeroInnerStyled,
	HeroMediaStyled,
	HeroTitleStyled,
	LedeStyled,
} from "./styled";

interface IHeroProps extends Omit<ComponentPropsWithoutRef<"section">, "title"> {
	eyebrow?: ReactNode;
	title: ReactNode;
	lede?: ReactNode;
	center?: boolean;
	// A media plate beside the copy. `true` draws the placeholder plate; a node
	// renders inside it.
	media?: ReactNode | boolean;
	// The primary call to action — pass a Button.
	children?: ReactNode;
}

export default function Hero({ eyebrow, title, lede, center, media, children, ...rest }: IHeroProps) {
	return (
		<HeroBandStyled {...rest}>
			<HeroInnerStyled $center={center}>
				{eyebrow && <EyebrowStyled>{eyebrow}</EyebrowStyled>}
				<HeroTitleStyled>{title}</HeroTitleStyled>
				{lede && <LedeStyled>{lede}</LedeStyled>}
				{children && <HeroActionsStyled>{children}</HeroActionsStyled>}
				{media && (
					<HeroMediaStyled aria-hidden="true">{typeof media === "boolean" ? null : media}</HeroMediaStyled>
				)}
			</HeroInnerStyled>
		</HeroBandStyled>
	);
}
