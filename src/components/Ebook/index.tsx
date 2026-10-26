import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { EBlurbStyled, EBodyStyled, EbookStyled, ECoverStyled, EFootStyled, ETitleStyled } from "./styled";

interface IEbookProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
	title: ReactNode;
	blurb?: ReactNode;
	// The cover art. A node renders inside the plate; omit for the placeholder.
	cover?: ReactNode;
	// The footer row — a Price and a link or Button.
	children?: ReactNode;
}

export default function Ebook({ title, blurb, cover, children, ...rest }: IEbookProps) {
	return (
		<EbookStyled {...rest}>
			<ECoverStyled aria-hidden="true">{cover}</ECoverStyled>
			<EBodyStyled>
				<ETitleStyled>{title}</ETitleStyled>
				{blurb && <EBlurbStyled>{blurb}</EBlurbStyled>}
				{children && <EFootStyled>{children}</EFootStyled>}
			</EBodyStyled>
		</EbookStyled>
	);
}
