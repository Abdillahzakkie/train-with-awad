"use client";
import styled, { css } from "styled-components";

export const FieldStyled = styled.div<{ $invalid?: boolean }>`
	display: flex;
	flex-direction: column;
	gap: 6px;
	${({ $invalid }) =>
		$invalid &&
		css`
			input,
			textarea,
			select {
				border-color: var(--tw-danger);
			}
		`}
`;
