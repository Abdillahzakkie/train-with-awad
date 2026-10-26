import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Server and content tests run in node. Component tests (added with the UI kit)
// set jsdom per file with `// @vitest-environment jsdom`.
export default defineConfig({
	test: {
		environment: "node",
		globals: true,
		include: ["src/**/*.test.ts", "src/**/*.test.tsx", "tests/**/*.test.ts"],
		// Placeholder keys keep emailEnabled/stripeEnabled false so tests exercise
		// the disabled paths without a real account. The test database name is
		// distinct from the app's and is dropped by the integration suite.
		env: {
			NODE_ENV: "test",
			MONGODB_URI: "mongodb://127.0.0.1:27018/train-with-awad-test",
			RESEND_API_KEY: "re_placeholder_local_only",
			EMAIL_FROM: "Train With Awad <onboarding@resend.dev>",
			COACH_NOTIFY_EMAIL: "coach@example.com",
			STRIPE_SECRET_KEY: "sk_test_placeholder",
			STRIPE_WEBHOOK_SECRET: "whsec_placeholder",
			NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
		},
	},
	resolve: {
		alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
	},
});
