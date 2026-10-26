import { endSession } from "@/server/auth";
import { NextResponse } from "next/server";

export async function POST() {
	await endSession();
	return NextResponse.json({ ok: true });
}
