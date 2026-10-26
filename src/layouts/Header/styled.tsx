"use client";
import styled, { css } from "styled-components";

export const HeaderStyled = styled.header`
	background: var(--tw-surface);
	border-bottom: 1px solid var(--tw-line);
`;

export const BrandStyled = styled.span`
	display: flex;
	align-items: center;
	gap: 10px;
	font-size: 19px;
	font-weight: 800;
	letter-spacing: -0.015em;
`;

// The desktop top bar: brand, nav links, one primary CTA. Hidden on a phone.
export const TopNavStyled = styled.div`
	display: none;
	align-items: center;
	gap: 28px;
	max-width: var(--tw-maxw);
	margin: 0 auto;
	padding: 0 var(--tw-pad);
	height: 68px;

	@media (min-width: 768px) {
		display: flex;
	}
`;

export const NavLinksStyled = styled.nav`
	display: flex;
	align-items: center;
	gap: 22px;
	font-size: 15px;
	font-weight: 600;
`;

export const NavLinkStyled = styled.a<{ $on?: boolean }>`
	color: var(--tw-text-2);
	text-decoration: none;
	${({ $on }) =>
		$on &&
		css`
			color: var(--tw-text);
		`}

	&:hover {
		color: var(--tw-text);
	}
`;

export const NavCtaStyled = styled.div`
	margin-left: auto;
`;

// The mobile bar: brand and a menu toggle. Shown only below tablet.
export const MBarStyled = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 0 16px;
	height: 56px;

	@media (min-width: 768px) {
		display: none;
	}
`;

export const MenuBtnStyled = styled.button`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 4px;
	width: 44px;
	height: 44px;
	margin-left: auto;
	border: none;
	border-radius: var(--tw-radius-sm);
	background: transparent;
	cursor: pointer;

	span {
		display: block;
		width: 20px;
		height: 2px;
		border-radius: 2px;
		background: var(--tw-text-2);
	}
`;

export const MenuPanelStyled = styled.nav`
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding: 8px 16px 16px;
	border-top: 1px solid var(--tw-line);

	a {
		color: var(--tw-text-2);
		text-decoration: none;
		font-weight: 600;
		padding: 10px 0;
	}

	@media (min-width: 768px) {
		display: none;
	}
`;
