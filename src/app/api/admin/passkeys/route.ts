import { requireAdmin } from "@/server/auth";
import { connectToDatabase } from "@/server/db/connect";
import { Passkey } from "@/server/models/Passkey";
import { errorResponse } from "../_guard";

// The signed-in admin's own passkeys, for the Settings page. Never returns the
// public key or counter — only what the list needs.
export async function GET() {
	try {
		const session = await requireAdmin();
		await connectToDatabase();
		const docs = await Passkey.find({ userId: session.sub }).sort({ createdAt: -1 }).lean();
		return Response.json({
			items: docs.map((d) => ({
				id: String(d._id),
				deviceName: d.deviceName,
				createdAt: d.createdAt,
			})),
		});
	} catch (e) {
		return errorResponse(e);
	}
}
