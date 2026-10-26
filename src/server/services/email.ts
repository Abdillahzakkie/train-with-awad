import { Resend } from "resend";
import { config } from "@/server/config";
import type { IEmailMessage, TEbookSlug } from "@/types";

let client: Resend | null = null;

function resend(): Resend {
	if (!client) {
		client = new Resend(config.RESEND_API_KEY);
	}
	return client;
}

// Send one transactional email. When email is disabled (placeholder key), log
// the message the server would send and return ok, so local development works
// without a Resend account.
export async function sendEmail(message: IEmailMessage): Promise<{ ok: true }> {
	if (!config.emailEnabled) {
		console.info("[email] skipped (emailEnabled=false)", { to: message.to, subject: message.subject });
		return { ok: true };
	}
	const { error } = await resend().emails.send({
		from: config.EMAIL_FROM,
		to: message.to,
		subject: message.subject,
		html: message.html,
	});
	if (error) {
		throw new Error(`send email failed: ${error.message}`, { cause: error });
	}
	return { ok: true };
}

export interface INotifyCoachInput {
	name: string;
	email: string;
	phone?: string | null;
	mode: string;
	goal?: string | null;
	source?: string | null;
}

// Tell the coach a new enquiry arrived.
export async function notifyCoach(lead: INotifyCoachInput): Promise<{ ok: true }> {
	const lines = [
		`Name: ${lead.name}`,
		`Email: ${lead.email}`,
		lead.phone ? `Phone: ${lead.phone}` : null,
		`Mode: ${lead.mode}`,
		lead.goal ? `Goal: ${lead.goal}` : null,
		lead.source ? `Source: ${lead.source}` : null,
	].filter(Boolean);
	return sendEmail({
		to: config.COACH_NOTIFY_EMAIL,
		subject: `New enquiry from ${lead.name}`,
		html: `<p>${lines.join("<br>")}</p>`,
	});
}

export interface ISendDownloadLinkInput {
	email: string;
	ebookSlug: TEbookSlug;
	downloadUrl: string;
}

// Email the buyer a time-limited link to download their ebook.
export async function sendDownloadLink(input: ISendDownloadLinkInput): Promise<{ ok: true }> {
	return sendEmail({
		to: input.email,
		subject: "Your ebook download",
		html: `<p>Thanks for your purchase. Download your ebook with this link; it expires soon:</p><p><a href="${input.downloadUrl}">${input.downloadUrl}</a></p>`,
	});
}
