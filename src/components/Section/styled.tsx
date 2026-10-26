"use client";
import styled, { css } from "styled-components";

export const SectionBandStyled = styled.section`
	padding: calc(var(--tw-pad) * 1.5) 0;
`;

export const SectionInnerStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 18px;
	width: 100%;
	max-width: var(--tw-maxw);
	margin: 0 auto;
	padding: 0 var(--tw-pad);
`;

export const SHeadStyled = styled.div<{ $center?: boolean }>`
	display: flex;
	flex-direction: column;
	gap: 6px;
	${({ $center }) =>
		$center &&
		css`
			text-align: center;
			align-items: center;
		`}
`;

export const SeyebrowStyled = styled.span`
	font-size: var(--tw-fs-sm);
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--tw-accent);
`;

export const SectionTitleStyled = styled.h2`
	margin: 0;
	font-size: var(--tw-fs-lg);
	font-weight: 800;
	line-height: 1.15;
	letter-spacing: -0.015em;
`;

export const SsubStyled = styled.p`
	margin: 0;
	max-width: 56ch;
	color: var(--tw-text-2);
	font-size: var(--tw-fs);
	line-height: 1.5;
`;
