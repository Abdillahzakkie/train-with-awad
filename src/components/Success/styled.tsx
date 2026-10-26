"use client";
import styled from "styled-components";

export const SuccessStyled = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
	padding: 32px 24px;
	text-align: center;

	h4 {
		margin: 0;
		font-size: var(--tw-fs-lg);
		font-weight: 800;
	}

	p {
		margin: 0;
		max-width: 40ch;
		color: var(--tw-text-2);
		font-size: var(--tw-fs-sm);
		line-height: 1.5;
	}
`;

export const SuccessCheckStyled = styled.div`
	width: 56px;
	height: 56px;
	border-radius: 50%;
	background: var(--tw-ok-bg);
	border: 1px solid var(--tw-ok);
	color: var(--tw-ok);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26px;
	font-weight: 800;
`;
