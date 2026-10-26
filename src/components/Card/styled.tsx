"use client";
import styled from "styled-components";

export const CardStyled = styled.div`
	background: var(--tw-card-bg);
	border: 1px solid var(--tw-line);
	border-radius: var(--tw-radius);
	padding: var(--tw-pad);
	box-shadow: var(--tw-card-shadow);

	h5 {
		margin: 0 0 10px;
		font-size: var(--tw-fs);
		font-weight: 700;
		letter-spacing: -0.01em;
	}

	p {
		margin: 0;
		color: var(--tw-text-2);
		font-size: var(--tw-fs-sm);
		line-height: 1.5;
	}
`;

export const CardIconStyled = styled.div`
	display: grid;
	place-items: center;
	width: 44px;
	height: 44px;
	margin-bottom: 12px;
	border-radius: 12px;
	background: color-mix(in srgb, var(--tw-accent) 14%, transparent);
	border: 1px solid color-mix(in srgb, var(--tw-accent) 32%, transparent);
	color: var(--tw-accent);

	svg {
		width: 22px;
		height: 22px;
	}
`;
