"use client";

import styled from "styled-components";

// Layout for the content editor. Every colour is an --adm-* token from
// adminTheme, so nothing here carries a literal.

export const EditorStyled = styled.div`
	display: grid;
	gap: var(--adm-gap);
`;

export const PickerStyled = styled.div`
	max-width: 420px;
`;

export const SectionHeadStyled = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: var(--adm-gap);

	.meta {
		display: grid;
		gap: 2px;
	}
	.name {
		font-weight: 600;
		color: var(--adm-ink);
	}
	.hint {
		font-size: 0.85rem;
		color: var(--adm-ink-3);
	}
	.controls {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}
	&[data-hidden="true"] .name {
		color: var(--adm-ink-3);
	}
`;

export const FieldsStyled = styled.div`
	display: grid;
	gap: var(--adm-gap);
	margin-top: var(--adm-pad);
	padding-top: var(--adm-pad);
	border-top: 1px solid var(--adm-line);
`;

export const ArrayGroupStyled = styled.fieldset`
	display: grid;
	gap: var(--adm-gap);
	border: 1px solid var(--adm-line);
	border-radius: var(--adm-r-sm);
	padding: var(--adm-pad);
	margin: 0;

	.legend {
		font-weight: 600;
		color: var(--adm-ink-2);
	}
	.item {
		display: grid;
		gap: 8px;
		padding-top: 12px;
		border-top: 1px dashed var(--adm-line);
	}
	.item:first-of-type {
		border-top: 0;
		padding-top: 0;
	}
	.item-label {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--adm-ink-3);
	}
`;
