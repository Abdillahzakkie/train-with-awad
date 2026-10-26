"use client";

import styled from "styled-components";

// Intro copy above the passkey list. Colours are --adm-* tokens from adminTheme.
export const IntroStyled = styled.p`
	margin: 0 0 var(--adm-gap);
	color: var(--adm-ink-2);
`;

export const PasskeyListStyled = styled.ul`
	list-style: none;
	margin: 0 0 var(--adm-gap);
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
