"use client";

import styled from "styled-components";

// Intro copy above the passkey list. Colours are --adm-* tokens from adminTheme.
export const IntroStyled = styled.p`
	margin: 0;
	color: var(--adm-ink-2);
	line-height: 1.5;
`;

// A dark backdrop so a logo of any background (the default is white-on-black)
// reads clearly in the preview, whatever the admin's light surface.
export const LogoPreviewStyled = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
	border: 1px solid var(--adm-line);
	border-radius: var(--adm-r);
	background: #111418;

	img {
		display: block;
		width: auto;
		max-width: 100%;
		max-height: 72px;
	}
`;

export const PasskeyListStyled = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0;
	display: grid;
	gap: 8px;

	li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--adm-gap);
		border: 1px solid var(--adm-line);
		border-radius: var(--adm-r-sm);
		padding: 12px var(--adm-pad);
	}
	.pk-name {
		font-weight: 600;
		color: var(--adm-ink);
	}
	.pk-when {
		font-size: 0.85rem;
		color: var(--adm-ink-3);
	}
`;
