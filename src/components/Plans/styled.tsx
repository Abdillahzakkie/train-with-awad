"use client";
import styled from "styled-components";

// The three "ways to train": stacked on a phone, three across from tablet up.
export const PlansStyled = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: var(--tw-gap);

	@media (min-width: 768px) {
		grid-template-columns: repeat(3, 1fr);
	}
`;
