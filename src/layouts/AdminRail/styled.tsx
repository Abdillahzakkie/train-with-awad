"use client";

import styled from "styled-components";
import { adminLight } from "@/libs/adminTheme";

export const RailStyled = styled.nav`
	${adminLight}
	width: 260px;
	flex: none;
	background: var(--adm-surface);
	border-right: 1px solid var(--adm-line);
	display: flex;
	flex-direction: column;
	padding: 16px 12px;
	gap: 2px;

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 6px 10px 18px;
		font-size: 17px;
		font-weight: 800;
		letter-spacing: -0.015em;
		color: var(--adm-ink);
	}
	.rentry {
		display: flex;
		align-items: center;
		gap: 12px;
		min-height: 48px;
		padding: 10px 12px;
		border-radius: var(--adm-r-sm);
		color: var(--adm-ink-2);
		font-size: 15px;
		font-weight: 600;
		text-decoration: none;
	}
	.rentry:hover {
		background: var(--adm-surface-2);
		color: var(--adm-ink);
	}
	.rentry[data-on="true"] {
		background: var(--adm-accent-wash);
		color: var(--adm-accent-strong);
	}
	.rentry:focus-visible {
		outline: none;
		box-shadow: var(--adm-focus);
	}
	.ic {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 22px;
		font-size: 20px;
		flex: none;
	}
	.spacer {
		flex: 1;
	}
	.ruser {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 12px 10px;
		margin-top: 8px;
		border-top: 1px solid var(--adm-line);
	}
	.av {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		background: var(--adm-surface-2);
		border: 1px solid var(--adm-line-2);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 13px;
		color: var(--adm-ink-2);
		flex: none;
	}
	.who {
		min-width: 0;
	}
	.who .name {
		display: block;
		font-size: 14px;
		font-weight: 650;
		color: var(--adm-ink);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.who .email {
		display: block;
		font-size: 13px;
		color: var(--adm-ink-3);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.signout {
		display: flex;
		align-items: center;
		gap: 12px;
		min-height: 48px;
		padding: 10px 12px;
		border: 0;
		border-radius: var(--adm-r-sm);
		background: none;
		width: 100%;
		text-align: left;
		cursor: pointer;
		font: inherit;
		font-size: 15px;
		font-weight: 600;
		color: var(--adm-ink-2);
	}
	.signout:hover {
		background: var(--adm-surface-2);
		color: var(--adm-ink);
	}
	.signout:focus-visible {
		outline: none;
		box-shadow: var(--adm-focus);
	}

	.brand .close {
		display: none;
	}

	/* On a phone the rail is a slide-in drawer, revealed by the top bar's menu.
	   Labels stay visible here (unlike a cramped icon strip). The scrim behind it
	   and the top bar are separate elements below. Mirrors design/mockups. */
	@media (max-width: 820px) {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		z-index: 60;
		width: 280px;
		max-width: 82vw;
		transform: translateX(-100%);
		transition: transform 0.22s ease;
		box-shadow: 0 20px 48px rgba(15, 18, 22, 0.28);
		overflow-y: auto;

		&[data-open="true"] {
			transform: none;
		}
		.brand {
			justify-content: space-between;
		}
		.brand .close {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 36px;
			height: 36px;
			margin-left: auto;
			border: 0;
			border-radius: var(--adm-r-sm);
			background: none;
			color: var(--adm-ink-2);
			font-size: 22px;
			cursor: pointer;
		}
	}
`;

export const TopBarStyled = styled.header`
	display: none;

	@media (max-width: 820px) {
		display: flex;
		align-items: center;
		gap: 12px;
		height: 56px;
		flex: none;
		padding: 0 16px;
		position: sticky;
		top: 0;
		z-index: 40;
		background: var(--adm-surface);
		border-bottom: 1px solid var(--adm-line);

		.brand {
			display: flex;
			align-items: center;
			gap: 10px;
			font-size: 16px;
			font-weight: 800;
			letter-spacing: -0.015em;
			color: var(--adm-ink);
		}
		.menu {
			margin-left: auto;
			width: 44px;
			height: 44px;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 1px solid var(--adm-line);
			border-radius: var(--adm-r-sm);
			background: var(--adm-surface);
			color: var(--adm-ink-2);
			font-size: 22px;
			cursor: pointer;
		}
		.menu:focus-visible {
			outline: none;
			box-shadow: var(--adm-focus);
		}
	}
`;

export const ScrimStyled = styled.div`
	display: none;

	@media (max-width: 820px) {
		&[data-open="true"] {
			display: block;
			position: fixed;
			inset: 0;
			z-index: 50;
			background: rgba(15, 18, 22, 0.45);
		}
	}
`;
