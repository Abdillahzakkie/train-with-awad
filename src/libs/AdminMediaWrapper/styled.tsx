"use client";

import styled from "styled-components";

// One image tile in the media grid. Colours are --adm-* tokens from adminTheme.
export const MediaTileStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	border: 1px solid var(--adm-line);
	border-radius: var(--adm-r-sm);
	padding: var(--adm-pad);
	background: var(--adm-surface);

	img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		border-radius: var(--adm-r-sm);
		background: var(--adm-surface-2);
		border: 1px solid var(--adm-line);
	}
	.name {
		font-size: 0.85rem;
		color: var(--adm-ink-2);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.actions {
		display: flex;
		gap: 8px;
		margin-top: auto;
	}
`;
