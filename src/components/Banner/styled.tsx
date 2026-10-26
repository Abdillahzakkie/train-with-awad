"use client";
import styled, { css } from "styled-components";

export type TBannerTone = "info" | "warn" | "ok" | "danger";

const TONES: Record<TBannerTone, ReturnType<typeof css>> = {
	info: css`
		background: var(--tw-info-bg);
		color: var(--tw-info);
	`,
	warn: css`
		background: var(--tw-warn-bg);
		color: var(--tw-warn);
	`,
	ok: css`
		background: var(--tw-ok-bg);
		color: var(--tw-ok);
	`,
	danger: css`
		background: var(--tw-danger-bg);
		color: var(--tw-danger);
	`,
};

export const BannerStyled = styled.div<{ $tone: TBannerTone }>`
	padding: 12px 14px;
	border-radius: var(--tw-radius-sm);
	border-left: 3px solid currentColor;
	font-size: var(--tw-fs-sm);
	line-height: 1.45;
	${({ $tone }) => TONES[$tone]}

	strong {
		color: var(--tw-text);
	}
`;
