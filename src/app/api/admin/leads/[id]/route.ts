import { connectToDatabase } from "@/server/db/connect";
import { Lead } from "@/server/models/Lead";
import { clean } from "../../_crud";
import { errorResponse, guard } from "../../_guard";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Params) {
	try {
		await guard("leads", "read");
		await connectToDatabase();
		const { id } = await ctx.params;
		const doc = await Lead.findById(id).lean();
		if (!doc) return Response.json({ error: "Not found." }, { status: 404 });
		return Response.json({ item: clean(doc) });
	} catch (e) {
		return errorResponse(e);
	}
}

export async function PATCH(req: Request, ctx: Params) {
	try {
		await guard("leads", "full");
		const status = (await req.json().catch(() => null))?.status;
		if (status !== "New" && status !== "Handled") {
			return Response.json({ error: "status must be New or Handled." }, { status: 400 });
		}
		await connectToDatabase();
		const { id } = await ctx.params;
		const handledAt = status === "Handled" ? new Date() : null;
		const doc = await Lead.findByIdAndUpdate(
			id,
			{ $set: { status, handledAt } },
			{ returnDocument: "after", runValidators: true },
		).lean();
		if (!doc) return Response.json({ error: "Not found." }, { status: 404 });
		return Response.json({ item: clean(doc) });
	} catch (e) {
		return errorResponse(e);
	}
}
