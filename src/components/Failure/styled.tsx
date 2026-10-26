"use client";
import styled from "styled-components";

export const FailureStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 16px;
	border-radius: var(--tw-radius-sm);
	background: var(--tw-danger-bg);
	border: 1px solid var(--tw-danger);
	color: var(--tw-text-2);
	font-size: var(--tw-fs-sm);
	line-height: 1.5;

	p {
		margin: 0;
		color: var(--tw-text-2);
	}
`;

export const FailureTitleStyled = styled.span`
	font-weight: 700;
	color: var(--tw-text);
`;
