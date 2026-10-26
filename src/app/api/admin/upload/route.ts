import { deleteObject, ensureStorageReady, listObjects, uploadObject } from "@/server/storage";
import { errorResponse, guard } from "../_guard";

// Receives the file itself (multipart) and stores it server-side, so the
// browser never PUTs to storage directly.
export async function POST(req: Request) {
	try {
		await guard("media", "full");
		const form = await req.formData();
		const file = form.get("file");
		if (!(file instanceof File)) return Response.json({ error: "A file is required." }, { status: 400 });
		await ensureStorageReady();
		const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
		const key = `uploads/${Date.now()}-${safeName}`;
		const bytes = new Uint8Array(await file.arrayBuffer());
		const { publicUrl } = await uploadObject(key, bytes, file.type || "application/octet-stream");
		return Response.json({ url: publicUrl, key });
	} catch (e) {
		return errorResponse(e);
	}
}

export async function GET() {
	try {
		await guard("media", "read");
		return Response.json({ items: await listObjects() });
	} catch (e) {
		return errorResponse(e);
	}
}

export async function DELETE(req: Request) {
	try {
		await guard("media", "full");
		const key = (await req.json().catch(() => null))?.key;
		if (typeof key !== "string" || !key) return Response.json({ error: "key is required." }, { status: 400 });
		await deleteObject(key);
		return Response.json({ ok: true });
	} catch (e) {
		return errorResponse(e);
	}
}
