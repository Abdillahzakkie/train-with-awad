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
	width: 52px;
	height: 52px;
	margin-bottom: 4px;
	border-radius: 14px;
	background: var(--tw-surface-2);
	border: 1px solid var(--tw-line-2);
`;

export const EmptyTitleStyled = styled.span`
	color: var(--tw-text);
	font-weight: 700;
	font-size: var(--tw-fs);
`;
