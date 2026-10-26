"use client";
import styled from "styled-components";

export const EmptyStyled = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 10px;
	padding: 40px 24px;
	text-align: center;
	color: var(--tw-text-3);

	p {
		margin: 0;
		max-width: 38ch;
		font-size: var(--tw-fs-sm);
		line-height: 1.5;
	}
`;

export const EmptyGlyphStyled = styled.div`
	display: grid;
	place-items: center;
	width: 52px;
	height: 52px;
	margin-bottom: 4px;
	border-radius: 14px;
	background: color-mix(in srgb, var(--tw-accent) 14%, transparent);
	border: 1px solid color-mix(in srgb, var(--tw-accent) 32%, transparent);
	color: var(--tw-accent);

	svg {
		width: 26px;
		height: 26px;
	}
`;

export const EmptyTitleStyled = styled.span`
	color: var(--tw-text);
	font-weight: 700;
	font-size: var(--tw-fs);
`;
