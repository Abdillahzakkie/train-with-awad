"use client";
import styled from "styled-components";

export const FaqItemStyled = styled.div`
	border-bottom: 1px solid var(--tw-line);
	padding: 16px 0;

	&:first-child {
		padding-top: 0;
	}
`;

export const FaqQStyled = styled.button<{ $open?: boolean }>`
	display: flex;
	align-items: center;
	gap: 12px;
	width: 100%;
	padding: 0;
	border: none;
	background: transparent;
	color: var(--tw-text);
	font: inherit;
	font-size: var(--tw-fs);
	font-weight: 700;
	line-height: 1.4;
	text-align: left;
	cursor: pointer;

	&::after {
		content: "${({ $open }) => ($open ? "\\2212" : "+")}";
		margin-left: auto;
		flex: none;
		color: var(--tw-text-3);
		font-size: 20px;
	}
`;

export const FaqAStyled = styled.div`
	margin: 10px 0 0;
	max-width: 64ch;
	color: var(--tw-text-2);
	font-size: var(--tw-fs-sm);
	line-height: 1.55;
`;
