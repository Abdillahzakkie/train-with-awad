"use client";
import type { ReactNode } from "react";
import { FBrandStyled, FColStyled, FooterInnerStyled, FooterStyled } from "./styled";

export interface IFooterLink {
	href: string;
	label: string;
}

export interface IFooterColumn {
	heading: string;
	links: IFooterLink[];
}

interface IFooterProps {
	// Legal lives in a column here, passed in with the rest of the copy.
	brand: ReactNode;
	tagline?: ReactNode;
	columns: IFooterColumn[];
}

export default function Footer({ brand, tagline, columns }: IFooterProps) {
	return (
		<FooterStyled>
			<FooterInnerStyled>
				<FBrandStyled>
					{brand}
					{tagline && <p>{tagline}</p>}
				</FBrandStyled>
				{columns.map((column) => (
					<FColStyled key={column.heading}>
						<h6>{column.heading}</h6>
						{column.links.map((link) => (
							<a key={link.href} href={link.href}>
								{link.label}
							</a>
						))}
					</FColStyled>
				))}
			</FooterInnerStyled>
		</FooterStyled>
	);
}
