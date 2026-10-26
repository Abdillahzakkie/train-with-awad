"use client";

import { createGlobalStyle, css } from "styled-components";

/**
 * The admin renders light, calm, and high-contrast — the opposite of the dark
 * public site. The public root GlobalStyle sets dark --tw-* on :root, and custom
 * properties inherit, so an admin container re-declares its own light --adm-*
 * tokens to escape that cascade. Apply `adminLight` on the admin shell, the
 * sign-in container, and any dialog that portals out of the shell.
 *
 * Every colour the admin uses is a token defined here, so no consuming component
 * carries a literal.
 */
export const adminLight = css`
	--adm-bg: #f5f6f8;
	--adm-surface: #ffffff;
	--adm-surface-2: #eef1f5;

	--adm-ink: #121722;
	--adm-ink-2: #3f4a59;
	--adm-ink-3: #626d7c;

	--adm-line: #e4e8ee;
	--adm-line-2: #8b97a6;

	--adm-accent: #a96f22;
	--adm-accent-strong: #8a5a18;
	--adm-accent-wash: #fbf3e4;
	--adm-accent-100: #f3e3c4;

	--adm-pri-bg: #141a24;
	--adm-pri-fg: #ffffff;

	--adm-danger: #b3261e;
	--adm-danger-fg: #ffffff;
	--adm-danger-bg: #fdeceb;
	--adm-ok: #1e7a46;
	--adm-ok-bg: #e6f4ec;
	--adm-warn: #8a5a12;
	--adm-warn-bg: #f8efdd;
	--adm-info: #2f5fa0;
	--adm-info-bg: #e9f0fa;
	--adm-idle-bg: #eef1f5;

	--adm-focus: 0 0 0 3px rgba(169, 111, 34, 0.28);
	--adm-shadow: 0 1px 2px rgba(18, 23, 34, 0.06), 0 10px 28px rgba(18, 23, 34, 0.08);
	--adm-knob-shadow: 0 1px 3px rgba(18, 23, 34, 0.3);
	--adm-scrim: rgba(18, 23, 34, 0.45);

	--adm-r-sm: 10px;
	--adm-r: 14px;
	--adm-r-lg: 18px;
	--adm-r-pill: 999px;

	/* Controls are large so a non-technical person hits them on any device. */
	--adm-ctl-h: 48px;
	--adm-ctl-h-lg: 56px;
	--adm-gap: 16px;
	--adm-pad: 20px;

	color-scheme: light;
	background: var(--adm-bg);
	color: var(--adm-ink);
`;

/**
 * A GlobalStyle that paints the whole viewport with the admin theme. Render it
 * at the top of an admin route (the sign-in page, or an admin shell) so the body
 * behind the content is light, not the public dark ground.
 */
export const AdminGlobalStyle = createGlobalStyle`
	body {
		${adminLight}
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
			"Noto Sans", sans-serif;
		-webkit-font-smoothing: antialiased;
	}
`;
