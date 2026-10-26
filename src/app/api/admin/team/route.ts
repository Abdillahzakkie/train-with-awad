import { hashPassword } from "@/server/auth";
import { connectToDatabase } from "@/server/db/connect";
import { publicUser } from "@/server/iam";
import { AdminUser } from "@/server/models/AdminUser";
import { errorResponse, guard } from "../_guard";
import { isRole, loadSystemGroups, roleOf, setUserRole } from "./_team";

export async function GET() {
	try {
		await guard("team", "read");
		await connectToDatabase();
		const [users, groups] = await Promise.all([
			AdminUser.find().sort({ createdAt: -1 }).lean(),
			loadSystemGroups(),
		]);
		const items = users.map((u) => ({ ...publicUser(u), role: roleOf(String(u._id), groups) }));
		return Response.json({ items });
	} catch (e) {
		return errorResponse(e);
	}
}

export async function POST(req: Request) {
	try {
		await guard("team", "full");
		const body = await req.json().catch(() => null);
		const name = typeof body?.name === "string" ? body.name.trim() : "";
		const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
		const password = typeof body?.password === "string" ? body.password : "";
		const role = body?.role;

		if (!email || !password) {
			return Response.json({ error: "An email and a temporary password are required." }, { status: 400 });
		}
		if (!isRole(role)) {
			return Response.json({ error: "Role must be Owner, Editor, or Viewer." }, { status: 400 });
		}

		await connectToDatabase();
		const existing = await AdminUser.findOne({ email }).select("_id").lean();
		if (existing) {
			return Response.json({ error: "An admin with that email already exists." }, { status: 409 });
		}

		const user = await AdminUser.create({
			email,
			name: name || "Admin",
			passwordHash: await hashPassword(password),
			status: "active",
		});
		await setUserRole(String(user._id), role);

		return Response.json({ item: { ...publicUser(user.toObject()), role } }, { status: 201 });
	} catch (e) {
		return errorResponse(e);
	}
}
