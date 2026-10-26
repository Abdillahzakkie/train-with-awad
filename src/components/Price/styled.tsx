"use client";
import styled from "styled-components";

// Money renders as money, with tabular figures so a price column aligns.
export const PriceStyled = styled.span`
	display: inline-flex;
	align-items: baseline;
	gap: 2px;
	font-weight: 800;
	font-size: var(--tw-fs-lg);
	font-variant-numeric: tabular-nums;
	font-feature-settings: "tnum" 1;
	color: var(--tw-text);
	white-space: nowrap;
`;
