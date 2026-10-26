import { connectToDatabase } from "@/server/db/connect";
import { publicUser } from "@/server/iam";
import { AdminUser } from "@/server/models/AdminUser";
import { Group } from "@/server/models/Group";
import { errorResponse, guard } from "../../_guard";
import { assertNotLastOwner, isRole, loadSystemGroups, roleOf, setUserRole } from "../_team";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Params) {
	try {
		await guard("team", "full");
		const body = await req.json().catch(() => null);
		const role = body?.role;
		const status = body?.status;

		if (role !== undefined && !isRole(role)) {
			return Response.json({ error: "Role must be Owner, Editor, or Viewer." }, { status: 400 });
		}
		if (status !== undefined && status !== "active" && status !== "disabled") {
			return Response.json({ error: "Status must be active or disabled." }, { status: 400 });
		}
		if (role === undefined && status === undefined) {
			return Response.json({ error: "Nothing to change." }, { status: 400 });
		}

		await connectToDatabase();
		const { id } = await ctx.params;
		const target = await AdminUser.findById(id).select("_id").lean();
		if (!target) return Response.json({ error: "Not found." }, { status: 404 });

		// Never let a demotion or a disable remove the last active owner.
		const demoting = role !== undefined && role !== "Owner";
		const disabling = status === "disabled";
		if (demoting || disabling) await assertNotLastOwner(id);

		if (role !== undefined) await setUserRole(id, role);
		if (status !== undefined) await AdminUser.updateOne({ _id: id }, { $set: { status } });

		const [updated, groups] = await Promise.all([AdminUser.findById(id).lean(), loadSystemGroups()]);
		if (!updated) return Response.json({ error: "Not found." }, { status: 404 });
		return Response.json({ item: { ...publicUser(updated), role: roleOf(id, groups) } });
	} catch (e) {
		return errorResponse(e);
	}
}

export async function DELETE(_req: Request, ctx: Params) {
	try {
		await guard("team", "full");
		await connectToDatabase();
		const { id } = await ctx.params;
		const target = await AdminUser.findById(id).select("_id").lean();
		if (!target) return Response.json({ error: "Not found." }, { status: 404 });

		// Never delete the last active owner.
		await assertNotLastOwner(id);

		await Group.updateMany({ members: id }, { $pull: { members: id } });
		await AdminUser.deleteOne({ _id: id });
		return Response.json({ ok: true });
	} catch (e) {
		return errorResponse(e);
	}
}
