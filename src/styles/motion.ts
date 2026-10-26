"use client";
import { css, keyframes } from "styled-components";

// A single entrance effect, reused so sections feel like one system. Import it
// rather than writing @keyframes in a component.
export const fadeUp = keyframes`
	from { opacity: 0; transform: translateY(10px); }
	to { opacity: 1; transform: none; }
`;

// Guard any non-essential animation with this so reduced-motion users opt out.
export const whenMotionOk = css`
	@media (prefers-reduced-motion: no-preference) {
		animation: ${fadeUp} 0.5s ease both;
	}
`;
