"use client";
import styled from "styled-components";

export const StatStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`;

export const StatValStyled = styled.span`
	font-size: var(--tw-fs-xl);
	font-weight: 800;
	line-height: 1.1;
	letter-spacing: -0.025em;
	font-variant-numeric: tabular-nums;
	color: var(--tw-accent);
	/* The approved stat glow, reusing the accent-glow token so no colour is a
	   literal. The token is a valid text-shadow (offset, blur, colour). */
	text-shadow: var(--tw-accent-glow);
`;

export const StatLabelStyled = styled.span`
	color: var(--tw-text-2);
	font-size: var(--tw-fs-sm);
	font-weight: 600;
	line-height: 1.35;
`;
