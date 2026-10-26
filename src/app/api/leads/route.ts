import { ServiceError } from "@/server/errors";
import { createLead } from "@/server/services/leads";
import { leadSchema } from "@/server/validators/lead";
import { NextResponse } from "next/server";

// POST a new enquiry. Validate against the shared schema, record the lead, and
// notify the coach. A failed notification does not fail the request — the lead
// is already saved (ARCHITECTURE.md §9).
export async function POST(request: Request) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Send a valid request body." }, { status: 400 });
	}

	const parsed = leadSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Check the form and try again.", issues: parsed.error.flatten().fieldErrors },
			{ status: 400 },
		);
	}

	try {
		await createLead(parsed.data);
		return NextResponse.json({ ok: true });
	} catch (error) {
		if (error instanceof ServiceError) {
			return NextResponse.json({ error: error.message }, { status: error.status });
		}
		console.error("POST /api/leads failed", error);
		return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
	}
}
