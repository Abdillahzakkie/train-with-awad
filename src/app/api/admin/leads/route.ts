import { connectToDatabase } from "@/server/db/connect";
import { Lead } from "@/server/models/Lead";
import { clean } from "../_crud";
import { errorResponse, guard } from "../_guard";

export async function GET() {
	try {
		await guard("leads", "read");
		await connectToDatabase();
		const docs = await Lead.find().sort({ createdAt: -1 }).lean();
		return Response.json({ items: docs.map((d) => clean(d)) });
	} catch (e) {
		return errorResponse(e);
	}
}
