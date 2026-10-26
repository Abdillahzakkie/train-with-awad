"use client";
import styled, { css } from "styled-components";

export const HeroBandStyled = styled.section`
	background: var(--tw-hero-glow);
`;

export const HeroInnerStyled = styled.div<{ $center?: boolean }>`
	display: flex;
	flex-direction: column;
	gap: 18px;
	width: 100%;
	max-width: var(--tw-maxw);
	margin: 0 auto;
	padding: calc(var(--tw-pad) * 2) var(--tw-pad);
	${({ $center }) =>
		$center &&
		css`
			text-align: center;
			align-items: center;
		`}
`;

export const EyebrowStyled = styled.span`
	font-size: var(--tw-fs-sm);
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--tw-accent);
`;

export const HeroTitleStyled = styled.h1`
	margin: 0;
	font-size: var(--tw-fs-xl);
	font-weight: 800;
	line-height: 1.1;
	letter-spacing: -0.02em;
`;

export const LedeStyled = styled.p`
	margin: 0;
	max-width: 52ch;
	font-size: var(--tw-fs-lg);
	color: var(--tw-text-2);
	line-height: 1.45;
`;

export const HeroActionsStyled = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	margin-top: 4px;
`;

export const HeroMediaStyled = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 220px;
	margin-top: 6px;
	border: 1px solid var(--tw-line-2);
	border-radius: var(--tw-radius);
	background: var(--tw-card-bg);
	box-shadow: var(--tw-card-shadow);
	color: var(--tw-text-3);
	font-size: var(--tw-fs-sm);
	font-weight: 600;
`;
