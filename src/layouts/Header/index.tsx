"use client";
import Button from "@/components/Button";
import { type ReactNode, useState } from "react";
import {
	BrandStyled,
	HeaderStyled,
	MBarStyled,
	MenuBtnStyled,
	MenuPanelStyled,
	NavCtaStyled,
	NavLinkStyled,
	NavLinksStyled,
	TopNavStyled,
	WmStyled,
} from "./styled";

export interface INavItem {
	href: string;
	label: string;
}

interface IHeaderProps {
	// Nav items, brand, and CTA come from the page or a content module, so no
	// copy is baked into the layout.
	brand: ReactNode;
	items: INavItem[];
	activeHref?: string;
	cta: INavItem;
}

export default function Header({ brand, items, activeHref, cta }: IHeaderProps) {
	const [open, setOpen] = useState(false);

	return (
		<HeaderStyled>
			<TopNavStyled>
				<BrandStyled>
					<WmStyled aria-hidden="true" />
					{brand}
				</BrandStyled>
				<NavLinksStyled>
					{items.map((item) => (
						<NavLinkStyled
							key={item.href}
							href={item.href}
							$on={item.href === activeHref}
							aria-current={item.href === activeHref ? "page" : undefined}
						>
							{item.label}
						</NavLinkStyled>
					))}
				</NavLinksStyled>
				<NavCtaStyled>
					<Button as="a" href={cta.href} variant="primary">
						{cta.label}
					</Button>
				</NavCtaStyled>
			</TopNavStyled>

			<MBarStyled>
				<BrandStyled>
					<WmStyled aria-hidden="true" />
					{brand}
				</BrandStyled>
				<MenuBtnStyled type="button" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
					<span />
					<span />
					<span />
				</MenuBtnStyled>
			</MBarStyled>
			{open && (
				<MenuPanelStyled>
					{items.map((item) => (
						<a
							key={item.href}
							href={item.href}
							aria-current={item.href === activeHref ? "page" : undefined}
						>
							{item.label}
						</a>
					))}
					<Button as="a" href={cta.href} variant="primary" block>
						{cta.label}
					</Button>
				</MenuPanelStyled>
			)}
		</HeaderStyled>
	);
}
