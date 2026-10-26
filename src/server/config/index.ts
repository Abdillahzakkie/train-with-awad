import { z } from "zod";

// Placeholder keys let local development run without real third-party accounts.
// Each prefix marks a value that signals "skip the real call" rather than fail.
const PLACEHOLDER_PREFIXES = {
	resend: "re_placeholder",
	stripeSecret: "sk_test_placeholder",
	stripeWebhook: "whsec_placeholder",
} as const;

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
	MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
	RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
	EMAIL_FROM: z.string().min(1, "EMAIL_FROM is required"),
	COACH_NOTIFY_EMAIL: z.string().email("COACH_NOTIFY_EMAIL must be an email address"),
	STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required"),
	STRIPE_WEBHOOK_SECRET: z.string().min(1, "STRIPE_WEBHOOK_SECRET is required"),
	NEXT_PUBLIC_SITE_URL: z.string().url("NEXT_PUBLIC_SITE_URL must be an absolute URL"),
});

// Read and validate the environment once, at module load, and fail closed.
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
	const issues = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
	throw new Error(`Invalid server configuration: ${issues}`);
}

const env = parsed.data;

const emailEnabled = !env.RESEND_API_KEY.startsWith(PLACEHOLDER_PREFIXES.resend);
const stripeEnabled =
	!env.STRIPE_SECRET_KEY.startsWith(PLACEHOLDER_PREFIXES.stripeSecret) &&
	!env.STRIPE_WEBHOOK_SECRET.startsWith(PLACEHOLDER_PREFIXES.stripeWebhook);

// A placeholder key is a development convenience only. Reject it in production
// so a real deploy never silently skips payment or email.
if (env.NODE_ENV === "production" && (!emailEnabled || !stripeEnabled)) {
	throw new Error("Invalid server configuration: placeholder keys are not allowed when NODE_ENV=production");
}

export const config = {
	...env,
	emailEnabled,
	stripeEnabled,
} as const;

export type TConfig = typeof config;
