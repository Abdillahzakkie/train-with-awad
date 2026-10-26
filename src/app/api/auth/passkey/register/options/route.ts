import { type AuthenticatorTransportFuture, generateRegistrationOptions } from "@simplewebauthn/server";
import { isoUint8Array } from "@simplewebauthn/server/helpers";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth";
import { connectToDatabase } from "@/server/db/connect";
import { AdminUser } from "@/server/models/AdminUser";
import { Passkey } from "@/server/models/Passkey";
import { rpID, rpName, setChallenge } from "@/server/webauthn";

export async function POST() {
	let session: Awaited<ReturnType<typeof requireAdmin>>;
	try {
		session = await requireAdmin();
	} catch (r) {
		return r as Response;
	}
	await connectToDatabase();
	const user = await AdminUser.findById(session.sub).lean();
	if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const existing = await Passkey.find({ userId: session.sub }).lean();
	const options = await generateRegistrationOptions({
		rpName,
		rpID,
		userName: user.email,
		userDisplayName: user.name || user.email,
		userID: isoUint8Array.fromUTF8String(String(user._id)),
		excludeCredentials: existing.map((p) => ({
			id: p.credentialId,
			transports: p.transports as AuthenticatorTransportFuture[],
		})),
		authenticatorSelection: { residentKey: "preferred", userVerification: "preferred" },
	});
	await setChallenge(options.challenge);
	return NextResponse.json(options);
}
