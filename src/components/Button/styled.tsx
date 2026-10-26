"use client";
import styled, { css } from "styled-components";

export type TButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type TButtonSize = "md" | "lg";

// One amber primary for the single conversion action; the rest recede. Values
// mirror the .btn classes in design/mockups/system.css.
const VARIANTS: Record<TButtonVariant, ReturnType<typeof css>> = {
	primary: css`
		background: var(--tw-accent-grad);
		border-color: var(--tw-accent);
		color: var(--tw-accent-ink);
		box-shadow: var(--tw-accent-glow);
	`,
	secondary: css`
		background: var(--tw-surface-2);
		border-color: var(--tw-line-2);
		color: var(--tw-text);
	`,
	outline: css`
		background: transparent;
		border-color: var(--tw-line-2);
		color: var(--tw-text);
	`,
	ghost: css`
		background: transparent;
		border-color: transparent;
		color: var(--tw-text-2);
	`,
};

export const ButtonStyled = styled.button<{
	$variant: TButtonVariant;
	$size: TButtonSize;
	$block?: boolean;
}>`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	height: var(--tw-ctl-h);
	min-height: 44px;
	padding: 0 20px;
	border: 1px solid var(--tw-line-2);
	border-radius: var(--tw-radius-sm);
	font: inherit;
	font-size: var(--tw-fs);
	font-weight: 700;
	white-space: nowrap;
	text-decoration: none;
	cursor: pointer;
	${({ $variant }) => VARIANTS[$variant]}
	${({ $size }) =>
		$size === "lg" &&
		css`
			height: 54px;
			min-height: 54px;
			padding: 0 26px;
			font-size: var(--tw-fs-lg);
		`}
	${({ $block }) =>
		$block &&
		css`
			width: 100%;
		`}
`;
