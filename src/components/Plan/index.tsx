import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { PCtaStyled, PDescStyled, PFeatStyled, PNameStyled, PPriceStyled, PTagStyled, PlanStyled } from "./styled";

interface IPlanProps extends ComponentPropsWithoutRef<"div"> {
	name: ReactNode;
	price: ReactNode;
	desc?: ReactNode;
	features?: string[];
	featured?: boolean;
	tag?: ReactNode;
	// The plan's call to action — pass a link or Button.
	children?: ReactNode;
}

export default function Plan({ name, price, desc, features, featured, tag, children, ...rest }: IPlanProps) {
	return (
		<PlanStyled $featured={featured} {...rest}>
			{tag && <PTagStyled>{tag}</PTagStyled>}
			<PNameStyled>{name}</PNameStyled>
			<PPriceStyled>{price}</PPriceStyled>
			{desc && <PDescStyled>{desc}</PDescStyled>}
			{features && features.length > 0 && (
				<PFeatStyled>
					{features.map((feature) => (
						<li key={feature}>{feature}</li>
					))}
				</PFeatStyled>
			)}
			{children && <PCtaStyled>{children}</PCtaStyled>}
		</PlanStyled>
	);
}
