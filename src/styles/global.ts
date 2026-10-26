"use client";
import { createGlobalStyle } from "styled-components";
import { TW_ACCENT, TW_BG } from "@/styles/colors";

// Design tokens as CSS custom properties, prefix --tw-. No ThemeProvider: server
// components read these too. Values match the approved design system in
// design/mockups/system.css; where they drift, that file and this must be
// reconciled in the same change. Dark by default, single amber accent.
export const GlobalStyle = createGlobalStyle`
	:root {
		--tw-bg: ${TW_BG};
		--tw-surface: #14171c;
		--tw-surface-2: #1b1f27;
		--tw-surface-3: #232833;

		--tw-text: #f4f5f7;
		--tw-text-2: #cfd4de;
		--tw-text-3: #8b92a0;
		--tw-text-4: #6b7280;
		--tw-muted: #a7aeba;

		--tw-accent: ${TW_ACCENT};
		--tw-accent-2: #f0c074;
		--tw-accent-ink: #10130a;
		--tw-accent-wash: #2a2112;

		--tw-line: #262b34;
		--tw-line-2: #646b7a;

		--tw-ok: #4ad58c; --tw-ok-bg: #0e2a1d;
		--tw-warn: #f0b445; --tw-warn-bg: #2c2110;
		--tw-danger: #f2757a; --tw-danger-bg: #301618;
		--tw-info: #7ba4ff; --tw-info-bg: #141f38;

		--tw-radius-sm: 10px;
		--tw-radius: 14px;
		--tw-radius-lg: 18px;
		--tw-radius-pill: 999px;

		--tw-shadow: 0 1px 2px rgba(0,0,0,.4), 0 12px 30px rgba(0,0,0,.35);
		--tw-card-shadow: inset 0 1px 0 rgba(255,255,255,.04), 0 10px 26px rgba(0,0,0,.5);
		--tw-card-bg: linear-gradient(180deg, #171b22, #14171c);
		--tw-accent-grad: linear-gradient(180deg, #eab857, #d8992f);
		--tw-accent-glow: 0 6px 22px rgba(224,169,74,.30);
		--tw-hero-glow: radial-gradient(120% 90% at 85% -10%, rgba(224,169,74,.12), transparent 60%);

		--tw-pad: 20px;
		--tw-gap: 16px;
		--tw-fs: 16px;
		--tw-fs-sm: 14px;
		--tw-fs-lg: 20px;
		--tw-fs-xl: 28px;
		--tw-ctl-h: 48px;
		--tw-maxw: 1120px;
	}

	/* The desk density: more room and a bigger display scale from tablet up. */
	@media (min-width: 768px) {
		:root { --tw-pad: 24px; --tw-gap: 20px; --tw-fs-lg: 22px; --tw-fs-xl: 44px; }
	}

	*, *::before, *::after { box-sizing: border-box; }
	html, body { margin: 0; padding: 0; }
	html { scroll-behavior: smooth; }
	body {
		background: var(--tw-bg);
		color: var(--tw-text);
		font: 16px/1.55 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
			"Helvetica Neue", Arial, "Noto Sans", sans-serif;
		-webkit-font-smoothing: antialiased;
		text-rendering: optimizeLegibility;
	}
	a { color: inherit; }
	img, svg { display: block; max-width: 100%; }

	/* Focus-visible ring on every control (ARCHITECTURE.md §7). */
	:focus-visible { outline: 2px solid var(--tw-accent); outline-offset: 2px; }

	@media (prefers-reduced-motion: reduce) {
		*, *::before, *::after {
			animation-duration: .01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: .01ms !important;
			scroll-behavior: auto !important;
		}
	}
`;
