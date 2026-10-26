"use client";
import styled from "styled-components";

// Generic responsive grid, mirroring the mockup's .g2/.g3/.g4: one column on a
// phone, N columns from tablet up.
export const GridStyled = styled.div<{ $cols: 2 | 3 | 4 }>`
	display: grid;
	grid-template-columns: 1fr;
	gap: var(--tw-gap);

	@media (min-width: 768px) {
		grid-template-columns: repeat(${({ $cols }) => $cols}, 1fr);
	}
`;
