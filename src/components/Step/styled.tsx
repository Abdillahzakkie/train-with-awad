"use client";
import styled from "styled-components";

export const StepStyled = styled.div`
	display: grid;
	grid-template-columns: 44px 1fr;
	gap: 16px;
	align-items: start;
`;

export const StepNumStyled = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 44px;
	height: 44px;
	border-radius: var(--tw-radius-pill);
	background: var(--tw-accent);
	color: var(--tw-accent-ink);
	font-size: 18px;
	font-weight: 800;
	font-variant-numeric: tabular-nums;
	flex: none;
`;

export const StepBodyStyled = styled.div`
	h5 {
		margin: 0 0 4px;
		font-size: var(--tw-fs);
		font-weight: 700;
	}

	p {
		margin: 0;
		color: var(--tw-text-2);
		font-size: var(--tw-fs-sm);
		line-height: 1.5;
	}
`;
