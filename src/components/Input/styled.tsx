"use client";
import styled, { css } from "styled-components";

export const InputStyled = styled.input<{ $area?: boolean }>`
	display: flex;
	align-items: center;
	width: 100%;
	height: var(--tw-ctl-h);
	padding: 0 14px;
	border: 1px solid var(--tw-line-2);
	border-radius: var(--tw-radius-sm);
	background: var(--tw-surface-2);
	color: var(--tw-text);
	font: inherit;
	font-size: var(--tw-fs);

	&::placeholder {
		color: var(--tw-text-3);
	}

	&:focus,
	&:focus-visible {
		border-color: var(--tw-accent);
		box-shadow: 0 0 0 3px var(--tw-accent-wash);
		outline: none;
	}

	${({ $area }) =>
		$area &&
		css`
			height: auto;
			min-height: 104px;
			padding: 12px 14px;
			align-items: flex-start;
			line-height: 1.5;
			resize: vertical;
		`}
`;
