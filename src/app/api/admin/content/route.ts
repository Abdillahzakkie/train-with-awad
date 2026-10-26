import { getSiteContent } from "@/server/data";
import { connectToDatabase } from "@/server/db/connect";
import { SiteContent } from "@/server/models/SiteContent";
import { errorResponse, guard } from "../_guard";

export async function GET() {
	try {
		await guard("content", "read");
		return Response.json({ data: await getSiteContent() });
	} catch (e) {
		return errorResponse(e);
	}
}

export async function PUT(req: Request) {
	try {
		await guard("content", "full");
		const data = (await req.json().catch(() => null))?.data;
		if (!data || typeof data !== "object" || Array.isArray(data)) {
			return Response.json({ error: "data must be an object." }, { status: 400 });
		}
		await connectToDatabase();
		await SiteContent.updateOne({ key: "site" }, { $set: { data } }, { upsert: true });
		return Response.json({ ok: true });
	} catch (e) {
		return errorResponse(e);
	}
}
