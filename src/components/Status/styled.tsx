"use client";
import styled, { css } from "styled-components";

export type TStatusTone = "ok" | "warn" | "danger" | "info";

// A word AND a colour, never a colour alone. The dot is the ::before marker.
const TONES: Record<TStatusTone, ReturnType<typeof css>> = {
	ok: css`
		color: var(--tw-ok);
		background: var(--tw-ok-bg);
	`,
	warn: css`
		color: var(--tw-warn);
		background: var(--tw-warn-bg);
	`,
	danger: css`
		color: var(--tw-danger);
		background: var(--tw-danger-bg);
	`,
	info: css`
		color: var(--tw-info);
		background: var(--tw-info-bg);
	`,
};

export const StatusStyled = styled.span<{ $tone: TStatusTone }>`
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 3px 12px;
	border-radius: var(--tw-radius-pill);
	font-size: var(--tw-fs-sm);
	font-weight: 700;
	line-height: 1.6;
	white-space: nowrap;
	${({ $tone }) => TONES[$tone]}

	&::before {
		content: "";
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: currentColor;
		flex: none;
	}
`;
