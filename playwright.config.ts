import { defineConfig, devices } from "@playwright/test";

// Run the production build on a dedicated port so it never clashes with a dev
// server on 3000. One worker: Chromium is memory-heavy on this machine.
const PORT = 3100;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: false,
	workers: 1,
	reporter: "line",
	globalTeardown: "./e2e/global-teardown.ts",
	use: { baseURL: BASE_URL, trace: "on-first-retry" },
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
	webServer: {
		// Dev mode: the config fails closed on placeholder keys when
		// NODE_ENV=production, so e2e runs against `next dev` where placeholders
		// are allowed. One server, compiled on demand.
		command: `pnpm exec next dev --port ${PORT}`,
		url: BASE_URL,
		reuseExistingServer: false,
		timeout: 180_000,
		// A throwaway e2e database on the shared Docker Mongo, dropped in global
		// teardown. Placeholder keys keep Stripe and email in their skipped paths.
		env: {
			NEXT_PUBLIC_SITE_URL: BASE_URL,
			MONGODB_URI: "mongodb://127.0.0.1:27018/train-with-awad-e2e",
			RESEND_API_KEY: "re_placeholder_local_only",
			EMAIL_FROM: "Train With Awad <onboarding@resend.dev>",
			COACH_NOTIFY_EMAIL: "coach@example.com",
			STRIPE_SECRET_KEY: "sk_test_placeholder",
			STRIPE_WEBHOOK_SECRET: "whsec_placeholder",
		},
	},
});
