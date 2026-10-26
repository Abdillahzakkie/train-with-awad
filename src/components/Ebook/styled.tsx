"use client";
import styled from "styled-components";

export const EbookStyled = styled.div`
	display: flex;
	flex-direction: column;
	overflow: hidden;
	background: var(--tw-card-bg);
	border: 1px solid var(--tw-line);
	border-radius: var(--tw-radius);
	box-shadow: var(--tw-card-shadow);
`;

export const ECoverStyled = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	aspect-ratio: 3 / 4;
	background: var(--tw-card-bg);
	border-bottom: 1px solid var(--tw-line);
	color: var(--tw-text-3);
	font-size: var(--tw-fs-sm);
	font-weight: 600;
`;

export const EBodyStyled = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 10px;
	padding: var(--tw-pad);
`;

export const ETitleStyled = styled.span`
	font-size: var(--tw-fs);
	font-weight: 700;
	letter-spacing: -0.01em;
`;

export const EBlurbStyled = styled.p`
	margin: 0;
	flex: 1;
	color: var(--tw-text-2);
	font-size: var(--tw-fs-sm);
	line-height: 1.45;
`;

export const EFootStyled = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	margin-top: 4px;
`;
