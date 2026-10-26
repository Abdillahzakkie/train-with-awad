import type { ComponentPropsWithoutRef, ReactNode } from "react";
import {
	SectionBandStyled,
	SectionInnerStyled,
	SectionTitleStyled,
	SeyebrowStyled,
	SHeadStyled,
	SsubStyled,
} from "./styled";

interface ISectionProps extends Omit<ComponentPropsWithoutRef<"section">, "title"> {
	eyebrow?: ReactNode;
	title?: ReactNode;
	sub?: ReactNode;
	center?: boolean;
	children?: ReactNode;
}

export default function Section({ eyebrow, title, sub, center, children, ...rest }: ISectionProps) {
	const hasHead = eyebrow || title || sub;
	return (
		<SectionBandStyled {...rest}>
			<SectionInnerStyled>
				{hasHead && (
					<SHeadStyled $center={center}>
						{eyebrow && <SeyebrowStyled>{eyebrow}</SeyebrowStyled>}
						{title && <SectionTitleStyled>{title}</SectionTitleStyled>}
						{sub && <SsubStyled>{sub}</SsubStyled>}
					</SHeadStyled>
				)}
				{children}
			</SectionInnerStyled>
		</SectionBandStyled>
	);
}
