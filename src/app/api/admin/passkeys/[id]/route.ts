import { requireAdmin } from "@/server/auth";
import { connectToDatabase } from "@/server/db/connect";
import { Passkey } from "@/server/models/Passkey";
import { errorResponse } from "../../_guard";

type Params = { params: Promise<{ id: string }> };

// Remove one of the signed-in admin's own passkeys. Scoped to userId so an admin
// can never delete someone else's credential.
export async function DELETE(_req: Request, ctx: Params) {
	try {
		const session = await requireAdmin();
		await connectToDatabase();
		const { id } = await ctx.params;
		const doc = await Passkey.findOneAndDelete({ _id: id, userId: session.sub }).lean();
		if (!doc) return Response.json({ error: "Not found." }, { status: 404 });
		return Response.json({ ok: true });
	} catch (e) {
		return errorResponse(e);
	}
}
