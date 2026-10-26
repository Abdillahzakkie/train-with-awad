"use client";
import styled, { css } from "styled-components";

export const PlanStyled = styled.div<{ $featured?: boolean }>`
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 14px;
	padding: var(--tw-pad);
	background: var(--tw-card-bg);
	border: 1px solid var(--tw-line);
	border-radius: var(--tw-radius);
	box-shadow: var(--tw-card-shadow);
	${({ $featured }) =>
		$featured &&
		css`
			border-color: var(--tw-accent);
			box-shadow: var(--tw-accent-glow);
		`}
`;

export const PTagStyled = styled.span`
	position: absolute;
	top: -11px;
	left: var(--tw-pad);
	padding: 3px 10px;
	border-radius: var(--tw-radius-pill);
	background: var(--tw-accent);
	color: var(--tw-accent-ink);
	font-size: 11px;
	font-weight: 800;
	letter-spacing: 0.06em;
	text-transform: uppercase;
`;

export const PNameStyled = styled.span`
	font-size: var(--tw-fs-lg);
	font-weight: 800;
	letter-spacing: -0.015em;
`;

export const PPriceStyled = styled.div`
	font-size: var(--tw-fs-xl);
	font-weight: 800;
	letter-spacing: -0.025em;
	font-variant-numeric: tabular-nums;

	small {
		font-size: var(--tw-fs-sm);
		font-weight: 600;
		color: var(--tw-text-3);
	}
`;

export const PDescStyled = styled.p`
	margin: 0;
	color: var(--tw-text-2);
	font-size: var(--tw-fs-sm);
	line-height: 1.5;
`;

export const PFeatStyled = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
	display: flex;
	flex-direction: column;
	gap: 10px;

	li {
		display: flex;
		gap: 10px;
		font-size: var(--tw-fs-sm);
		color: var(--tw-text-2);
		line-height: 1.4;
	}

	li::before {
		content: "";
		width: 18px;
		height: 18px;
		margin-top: 1px;
		border-radius: 50%;
		flex: none;
		background: var(--tw-ok-bg);
		border: 1px solid var(--tw-ok);
	}
`;

export const PCtaStyled = styled.div`
	margin-top: auto;
`;
