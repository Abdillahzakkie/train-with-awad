import { connectToDatabase } from "@/server/db/connect";
import { Settings } from "@/server/models/Settings";
import { getSettings, settingsInput } from "@/server/services/settings";
import { errorResponse, guard } from "../_guard";

export async function GET() {
	try {
		await guard("settings", "read");
		return Response.json({ settings: await getSettings() });
	} catch (e) {
		return errorResponse(e);
	}
}

export async function PUT(req: Request) {
	try {
		await guard("settings", "full");
		const parsed = settingsInput.safeParse(await req.json().catch(() => null));
		if (!parsed.success) {
			return Response.json({ error: parsed.error.issues[0]?.message ?? "Invalid settings." }, { status: 400 });
		}
		await connectToDatabase();
		await Settings.updateOne({ key: "settings" }, { $set: { data: parsed.data } }, { upsert: true });
		return Response.json({ settings: await getSettings() });
	} catch (e) {
		return errorResponse(e);
	}
}
