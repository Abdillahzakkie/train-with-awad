"use client";
import styled from "styled-components";

// Stacked on a phone, side by side from tablet up. $cols sets the desk count.
export const StepsStyled = styled.div<{ $cols: number }>`
	display: grid;
	grid-template-columns: 1fr;
	gap: var(--tw-gap);

	@media (min-width: 768px) {
		grid-template-columns: repeat(${({ $cols }) => $cols}, 1fr);
	}
`;
