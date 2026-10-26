import { startSession, verifyPassword } from "@/server/auth";
import { connectToDatabase } from "@/server/db/connect";
import { AdminUser } from "@/server/models/AdminUser";
import { NextResponse } from "next/server";

// Generic error for every failure path: never reveal which field was wrong.
const WRONG = NextResponse.json({ error: "Wrong email or password." }, { status: 401 });

export async function POST(req: Request) {
	await connectToDatabase();
	const { email, password } = (await req.json()) as { email?: string; password?: string };
	if (!email || !password) return WRONG;
	const user = await AdminUser.findOne({ email: email.toLowerCase(), status: "active" });
	if (!user || !(await verifyPassword(password, user.passwordHash))) return WRONG;
	await startSession({ sub: String(user._id), email: user.email });
	return NextResponse.json({ ok: true });
}
