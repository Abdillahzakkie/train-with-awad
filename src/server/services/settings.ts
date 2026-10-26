import { z } from "zod";
import { config } from "@/server/config";
import { connectToDatabase } from "@/server/db/connect";
import { Settings } from "@/server/models/Settings";

// The non-secret, admin-editable runtime settings. Each falls back to its env
// value when unset, so a fresh install works from env alone and the admin can
// override without a redeploy. Secrets (Stripe, Resend, JWT, S3) are NOT here —
// they stay in env.
export interface SiteSettings {
	coachNotifyEmail: string;
	emailFrom: string;
}

export const settingsInput = z.object({
	coachNotifyEmail: z.string().trim().email("Enter a valid email address."),
	emailFrom: z.string().trim().min(1, "Enter the from name and address."),
});

export async function getSettings(): Promise<SiteSettings> {
	await connectToDatabase();
	const doc = await Settings.findOne({ key: "settings" }).lean();
	const data = (doc?.data ?? {}) as Partial<SiteSettings>;
	return {
		coachNotifyEmail: data.coachNotifyEmail?.trim() || config.COACH_NOTIFY_EMAIL,
		emailFrom: data.emailFrom?.trim() || config.EMAIL_FROM,
	};
}
