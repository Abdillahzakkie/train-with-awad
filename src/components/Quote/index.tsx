import type { ComponentPropsWithoutRef, ReactNode } from "react";
import {
	QuoteAvatarStyled,
	QuoteByStyled,
	QuoteMetaStyled,
	QuoteNameStyled,
	QuoteStarsStyled,
	QuoteStyled,
	QuoteTextStyled,
} from "./styled";

interface IQuoteProps extends ComponentPropsWithoutRef<"blockquote"> {
	name: ReactNode;
	meta?: ReactNode;
	avatar?: ReactNode;
	// A rating out of five; renders filled and empty stars.
	stars?: number;
	children: ReactNode;
}

function renderStars(stars: number) {
	const filled = Math.max(0, Math.min(5, Math.round(stars)));
	return `${"★".repeat(filled)}${"☆".repeat(5 - filled)}`;
}

export default function Quote({ name, meta, avatar, stars, children, ...rest }: IQuoteProps) {
	return (
		<QuoteStyled {...rest}>
			{typeof stars === "number" && (
				<QuoteStarsStyled aria-label={`${Math.round(stars)} out of 5`}>{renderStars(stars)}</QuoteStarsStyled>
			)}
			<QuoteTextStyled>{children}</QuoteTextStyled>
			<QuoteByStyled>
				{avatar && <QuoteAvatarStyled aria-hidden="true">{avatar}</QuoteAvatarStyled>}
				<span>
					<QuoteNameStyled>{name}</QuoteNameStyled>
					{meta && <QuoteMetaStyled>{meta}</QuoteMetaStyled>}
				</span>
			</QuoteByStyled>
		</QuoteStyled>
	);
}
