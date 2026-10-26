"use client";
import styled, { css } from "styled-components";

export const ChipStyled = styled.span<{ $on?: boolean }>`
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 4px 12px;
	border-radius: var(--tw-radius-pill);
	background: var(--tw-surface-2);
	color: var(--tw-text-2);
	font-size: var(--tw-fs-sm);
	font-weight: 600;
	white-space: nowrap;
	${({ $on }) =>
		$on &&
		css`
			background: var(--tw-accent-wash);
			color: var(--tw-accent);
		`}
`;
