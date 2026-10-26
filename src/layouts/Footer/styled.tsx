"use client";
import styled from "styled-components";

export const FooterStyled = styled.footer`
	background: var(--tw-surface);
	border-top: 1px solid var(--tw-line);
`;

export const FooterInnerStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 28px;
	max-width: var(--tw-maxw);
	margin: 0 auto;
	padding: 40px var(--tw-pad);
	color: var(--tw-text-3);
	font-size: var(--tw-fs-sm);

	@media (min-width: 768px) {
		flex-direction: row;
	}
`;

export const FBrandStyled = styled.div`
	flex: 1.4;
	color: var(--tw-text);
	font-size: 18px;
	font-weight: 800;
	letter-spacing: -0.015em;

	p {
		margin: 10px 0 0;
		max-width: 34ch;
		color: var(--tw-text-3);
		font-size: var(--tw-fs-sm);
		font-weight: 400;
		line-height: 1.5;
	}
`;

export const FColStyled = styled.div`
	flex: 1;

	h6 {
		margin: 0 0 12px;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--tw-text-2);
	}

	a {
		display: block;
		padding: 4px 0;
		color: var(--tw-text-3);
		text-decoration: none;
	}

	a:hover {
		color: var(--tw-text-2);
	}
`;
