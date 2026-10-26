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
	.wm {
		width: 28px;
		height: 28px;
		border-radius: 8px;
		background: var(--adm-accent);
		flex: none;
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

	@media (max-width: 820px) {
		width: 76px;
		.brand .label,
		.rentry .label,
		.ruser .who,
		.signout .label {
			display: none;
		}
	}
`;
