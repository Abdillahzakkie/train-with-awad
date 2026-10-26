import { connectToDatabase } from "@/server/db/connect";
import { Lead, type TLeadDoc } from "@/server/models/Lead";
import { notifyCoach } from "@/server/services/email";
import type { TLeadInput } from "@/types";

// Record one enquiry, then notify the coach. The input is already validated
// upstream by the route against the shared zod schema.
//
// A failed email does not fail the request: the lead is saved, so the email
// error is logged and swallowed here on purpose, not rethrown.
export async function createLead(input: TLeadInput): Promise<TLeadDoc> {
	await connectToDatabase();
	const lead = await Lead.create(input);

	try {
		await notifyCoach({
			name: lead.name,
			email: lead.email,
			phone: lead.phone,
			mode: lead.mode,
			goal: lead.goal,
			source: lead.source,
		});
	} catch (error) {
		console.error("notify coach failed; lead is saved", { leadId: String(lead._id), error });
	}

	return lead;
}
