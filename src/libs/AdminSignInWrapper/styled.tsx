"use client";

import styled from "styled-components";
import { adminLight } from "@/libs/adminTheme";

export const SignInShell = styled.div`
	${adminLight}
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40px 20px;
`;

export const SignCard = styled.div`
	width: 420px;
	max-width: 100%;
	background: var(--adm-surface);
	border: 1px solid var(--adm-line);
	border-radius: var(--adm-r-lg);
	box-shadow: var(--adm-shadow);
	padding: 36px 32px;
	display: flex;
	flex-direction: column;
	gap: 18px;

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 20px;
		font-weight: 800;
		letter-spacing: -0.015em;
		color: var(--adm-ink);
	}
	.wm {
		width: 32px;
		height: 32px;
		border-radius: 9px;
		background: var(--adm-accent);
		flex: none;
	}
	h1 {
		margin: 0;
		font-size: 22px;
		font-weight: 700;
		color: var(--adm-ink);
	}
	.lede {
		margin: 0;
		font-size: 15px;
		color: var(--adm-ink-3);
		line-height: 1.5;
	}
	.passkey-hint {
		margin: 0;
		font-size: 14px;
		color: var(--adm-ink-3);
		line-height: 1.45;
		text-align: center;
	}
	.alt {
		align-self: center;
		border: 0;
		background: none;
		color: var(--adm-accent-strong);
		font: inherit;
		font-size: 15px;
		font-weight: 650;
		cursor: pointer;
		padding: 4px 8px;
		text-decoration: underline;
	}
	.alt:focus-visible {
		outline: none;
		box-shadow: var(--adm-focus);
		border-radius: var(--adm-r-sm);
	}
	.pw-form {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding-top: 4px;
		border-top: 1px solid var(--adm-line);
	}
`;
