import { z } from "zod";
import { config } from "@/server/config";
import { connectToDatabase } from "@/server/db/connect";
import { Settings } from "@/server/models/Settings";

// The brand logo shipped with the app, shown until an admin uploads their own.
export const DEFAULT_LOGO_URL = "/brand/logo.jpg";

// The non-secret, admin-editable runtime settings. Each falls back to its env
// value (or a built-in default) when unset, so a fresh install works from env
// alone and the admin can override without a redeploy. Secrets (Stripe, Resend,
// JWT, S3) are NOT here — they stay in env.
export interface SiteSettings {
	coachNotifyEmail: string;
	emailFrom: string;
	logoUrl: string;
}

export const settingsInput = z.object({
	coachNotifyEmail: z.string().trim().email("Enter a valid email address."),
	emailFrom: z.string().trim().min(1, "Enter the from name and address."),
	// Empty means "use the built-in default"; getSettings resolves it.
	logoUrl: z.string().trim().max(500).default(""),
});

export async function getSettings(): Promise<SiteSettings> {
	await connectToDatabase();
	const doc = await Settings.findOne({ key: "settings" }).lean();
	const data = (doc?.data ?? {}) as Partial<SiteSettings>;
	return {
		coachNotifyEmail: data.coachNotifyEmail?.trim() || config.COACH_NOTIFY_EMAIL,
		emailFrom: data.emailFrom?.trim() || config.EMAIL_FROM,
		logoUrl: data.logoUrl?.trim() || DEFAULT_LOGO_URL,
	};
}
