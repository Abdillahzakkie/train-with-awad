"use client";
import styled from "styled-components";

export const QuoteStyled = styled.blockquote`
	display: flex;
	flex-direction: column;
	gap: 14px;
	margin: 0;
	padding: var(--tw-pad);
	background: var(--tw-card-bg);
	border: 1px solid var(--tw-line);
	border-radius: var(--tw-radius);
	box-shadow: var(--tw-card-shadow);
`;

export const QuoteStarsStyled = styled.div`
	color: var(--tw-accent);
	font-size: var(--tw-fs-sm);
	letter-spacing: 0.1em;
`;

export const QuoteTextStyled = styled.p`
	margin: 0;
	font-size: var(--tw-fs-lg);
	font-weight: 500;
	line-height: 1.45;
	color: var(--tw-text);
`;

export const QuoteByStyled = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const QuoteAvatarStyled = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background: var(--tw-surface-2);
	border: 1px solid var(--tw-line-2);
	color: var(--tw-text-2);
	font-size: 14px;
	font-weight: 700;
	flex: none;
`;

export const QuoteNameStyled = styled.span`
	display: block;
	font-weight: 700;
	line-height: 1.25;
`;

export const QuoteMetaStyled = styled.span`
	display: block;
	color: var(--tw-text-3);
	font-size: var(--tw-fs-sm);
	line-height: 1.3;
`;
