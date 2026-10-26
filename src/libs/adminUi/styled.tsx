"use client";

import { adminLight } from "@/libs/adminTheme";
import styled, { css } from "styled-components";

export type TAdminVariant = "primary" | "secondary" | "danger";
export type TAdminSize = "md" | "lg";
export type TTone = "ok" | "warn" | "danger" | "info" | "idle";

const VARIANTS: Record<TAdminVariant, ReturnType<typeof css>> = {
	primary: css`
		background: var(--adm-pri-bg);
		color: var(--adm-pri-fg);
		border-color: var(--adm-pri-bg);
	`,
	secondary: css`
		background: var(--adm-surface);
		color: var(--adm-ink);
		border-color: var(--adm-line-2);
	`,
	danger: css`
		background: var(--adm-danger);
		color: var(--adm-danger-fg);
		border-color: var(--adm-danger);
	`,
};

export const AdminButtonStyled = styled.button<{
	$variant: TAdminVariant;
	$size: TAdminSize;
	$block?: boolean;
}>`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	height: ${({ $size }) => ($size === "lg" ? "var(--adm-ctl-h-lg)" : "var(--adm-ctl-h)")};
	min-height: 44px;
	padding: 0 ${({ $size }) => ($size === "lg" ? "28px" : "20px")};
	border: 1px solid var(--adm-line-2);
	border-radius: var(--adm-r-sm);
	font: inherit;
	font-size: ${({ $size }) => ($size === "lg" ? "17px" : "15px")};
	font-weight: 650;
	white-space: nowrap;
	text-decoration: none;
	cursor: pointer;
	${({ $variant }) => VARIANTS[$variant]}
	${({ $block }) =>
		$block &&
		css`
			width: 100%;
		`}

	&:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}
	&:focus-visible {
		outline: none;
		box-shadow: var(--adm-focus);
	}
`;

export const AdminCardStyled = styled.div`
	border: 1px solid var(--adm-line);
	border-radius: var(--adm-r);
	background: var(--adm-surface);
	padding: var(--adm-pad);
	box-shadow: var(--adm-shadow);

	h2 {
		margin: 0 0 14px;
		font-size: 16px;
		font-weight: 700;
		color: var(--adm-ink);
	}
`;

export const PageHeaderStyled = styled.header`
	display: flex;
	align-items: flex-start;
	gap: 16px;
	margin-bottom: 24px;

	h1 {
		margin: 0;
		font-size: 26px;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: var(--adm-ink);
	}
	p {
		margin: 6px 0 0;
		font-size: 15px;
		color: var(--adm-ink-3);
		line-height: 1.5;
	}
	.actions {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 10px;
		flex: none;
	}

	@media (max-width: 640px) {
		flex-wrap: wrap;
		.actions {
			margin-left: 0;
			width: 100%;
		}
	}
`;

export const FieldStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 7px;

	label {
		font-size: 15px;
		font-weight: 650;
		color: var(--adm-ink-2);
	}
	.req {
		color: var(--adm-accent);
		margin-left: 2px;
	}
	.hint {
		font-size: 14px;
		color: var(--adm-ink-3);
		line-height: 1.4;
	}
	.err {
		font-size: 14px;
		font-weight: 600;
		color: var(--adm-danger);
	}
`;

const controlBase = css`
	width: 100%;
	min-height: var(--adm-ctl-h);
	border: 1px solid var(--adm-line-2);
	border-radius: var(--adm-r-sm);
	background: var(--adm-surface);
	color: var(--adm-ink);
	font: inherit;
	font-size: 16px;
	padding: 0 14px;

	&::placeholder {
		color: var(--adm-ink-3);
	}
	&:focus,
	&:focus-visible {
		outline: none;
		border-color: var(--adm-accent);
		box-shadow: var(--adm-focus);
	}
	&:disabled {
		background: var(--adm-surface-2);
		color: var(--adm-ink-3);
	}
`;

export const AdminInputStyled = styled.input`
	${controlBase}
	height: var(--adm-ctl-h);
`;

export const AdminTextareaStyled = styled.textarea`
	${controlBase}
	min-height: 120px;
	padding: 12px 14px;
	line-height: 1.5;
	resize: vertical;
`;

// The admin main area and its padded inner column. The main scrolls; the inner
// keeps content off the top edge and within a readable width, so a page header's
// action never jams the viewport corner (design/mockups 03-admin).
export const AdminMainStyled = styled.main`
	flex: 1;
	min-width: 0;
	overflow-y: auto;
`;

export const AdminInnerStyled = styled.div`
	max-width: 1040px;
	margin: 0 auto;
	padding: 40px 48px 56px;

	@media (max-width: 640px) {
		padding: 24px 16px 40px;
	}
`;

export const TableStyled = styled.div`
	border: 1px solid var(--adm-line);
	border-radius: var(--adm-r);
	background: var(--adm-surface);
	overflow: hidden;

	table {
		width: 100%;
		border-collapse: collapse;
	}
	th {
		text-align: left;
		font-size: 12px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--adm-ink-3);
		background: var(--adm-surface-2);
		padding: 0 16px;
		height: 46px;
		border-bottom: 1px solid var(--adm-line);
		white-space: nowrap;
	}
	td {
		padding: 14px 16px;
		border-bottom: 1px solid var(--adm-line);
		vertical-align: middle;
		font-size: 15px;
		color: var(--adm-ink);
	}
	tbody tr:last-child td {
		border-bottom: 0;
	}
	tbody tr:hover {
		background: var(--adm-accent-wash);
	}
	.cell-actions {
		display: inline-flex;
		gap: 8px;
		flex-wrap: wrap;
	}
`;

// A responsive grid for dashboard tiles and card rows: one column on a phone,
// N columns from tablet up.
export const AdminGridStyled = styled.div<{ $cols: 2 | 3 | 4 }>`
	display: grid;
	grid-template-columns: 1fr;
	gap: var(--adm-gap);

	@media (min-width: 768px) {
		grid-template-columns: repeat(${({ $cols }) => $cols}, 1fr);
	}
`;

const TONE: Record<TTone, ReturnType<typeof css>> = {
	ok: css`
		color: var(--adm-ok);
		background: var(--adm-ok-bg);
	`,
	warn: css`
		color: var(--adm-warn);
		background: var(--adm-warn-bg);
	`,
	danger: css`
		color: var(--adm-danger);
		background: var(--adm-danger-bg);
	`,
	info: css`
		color: var(--adm-info);
		background: var(--adm-info-bg);
	`,
	idle: css`
		color: var(--adm-ink-3);
		background: var(--adm-idle-bg);
	`,
};

export const BadgeStyled = styled.span<{ $tone: TTone }>`
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 4px 12px;
	border-radius: var(--adm-r-pill);
	font-size: 14px;
	font-weight: 650;
	white-space: nowrap;
	${({ $tone }) => TONE[$tone]}

	&::before {
		content: "";
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: currentColor;
		flex: none;
	}
`;

export const NoticeStyled = styled.div<{ $tone: TTone }>`
	display: flex;
	align-items: flex-start;
	gap: 10px;
	padding: 14px 16px;
	border-radius: var(--adm-r-sm);
	border-left: 4px solid currentColor;
	font-size: 15px;
	line-height: 1.45;
	${({ $tone }) => TONE[$tone]}

	.notice-body {
		flex: 1;
		color: var(--adm-ink);
	}
	.notice-dismiss {
		border: 0;
		background: none;
		color: currentColor;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
		padding: 0 4px;
	}
`;

export const EmptyStyled = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 12px;
	padding: 64px 24px;
	text-align: center;
	border: 1px solid var(--adm-line);
	border-radius: var(--adm-r);
	background: var(--adm-surface);

	.eglyph {
		width: 56px;
		height: 56px;
		border-radius: 16px;
		background: var(--adm-surface-2);
		border: 1px solid var(--adm-line);
	}
	h2 {
		margin: 0;
		font-size: 19px;
		font-weight: 700;
		color: var(--adm-ink);
	}
	p {
		margin: 0;
		max-width: 44ch;
		font-size: 15px;
		color: var(--adm-ink-3);
		line-height: 1.5;
	}
	.ebtn {
		margin-top: 8px;
	}
`;

export const ToggleRowStyled = styled.div`
	display: flex;
	align-items: center;
	gap: 14px;

	.tlabel {
		font-size: 16px;
		font-weight: 600;
		color: var(--adm-ink-2);
	}
	.switch {
		margin-left: auto;
		width: 52px;
		height: 30px;
		border-radius: var(--adm-r-pill);
		border: 0;
		background: var(--adm-line-2);
		position: relative;
		cursor: pointer;
		flex: none;
	}
	.switch::after {
		content: "";
		position: absolute;
		top: 3px;
		left: 3px;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--adm-surface);
		box-shadow: var(--adm-knob-shadow);
		transition: left 0.15s ease;
	}
	.switch[data-on="true"] {
		background: var(--adm-accent);
	}
	.switch[data-on="true"]::after {
		left: 25px;
	}
	.switch:focus-visible {
		outline: none;
		box-shadow: var(--adm-focus);
	}
`;

export const OverlayStyled = styled.div`
	/* Re-declare tokens so the scrim resolves wherever the modal mounts. */
	${adminLight}
	position: fixed;
	inset: 0;
	z-index: 60;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24px;
	background: var(--adm-scrim);
`;

export const DialogStyled = styled.dialog`
	/* Re-declare the light tokens so colours resolve even if the dialog portals
	   out of the admin shell. */
	${adminLight}
	/* Override the UA dialog box so the overlay's flexbox centres it. */
	position: static;
	margin: 0;
	inset: auto;
	width: 440px;
	max-width: 100%;
	max-height: calc(100vh - 48px);
	overflow-y: auto;
	background: var(--adm-surface);
	border: 1px solid var(--adm-line);
	border-radius: var(--adm-r-lg);
	box-shadow: var(--adm-shadow);
	padding: 24px;
	display: flex;
	flex-direction: column;
	gap: 14px;

	h2 {
		margin: 0;
		font-size: 19px;
		font-weight: 700;
		color: var(--adm-ink);
	}
	p {
		margin: 0;
		font-size: 15px;
		color: var(--adm-ink-2);
		line-height: 1.5;
	}
	.dialog-actions {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
		margin-top: 6px;
	}
`;
