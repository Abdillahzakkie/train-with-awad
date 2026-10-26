import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { isoBase64URL } from "@simplewebauthn/server/helpers";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth";
import { connectToDatabase } from "@/server/db/connect";
import { Passkey } from "@/server/models/Passkey";
import { clearChallenge, getChallenge, origin, rpID } from "@/server/webauthn";

export async function POST(req: Request) {
	let session: Awaited<ReturnType<typeof requireAdmin>>;
	try {
		session = await requireAdmin();
	} catch (r) {
		return r as Response;
	}
	const { response, deviceName } = await req.json();
	const expectedChallenge = await getChallenge();
	if (!expectedChallenge) {
		return NextResponse.json({ error: "No challenge in progress." }, { status: 400 });
	}

	let verification: Awaited<ReturnType<typeof verifyRegistrationResponse>>;
	try {
		verification = await verifyRegistrationResponse({
			response,
			expectedChallenge,
			expectedOrigin: origin,
			expectedRPID: rpID,
		});
	} catch (e) {
		return NextResponse.json({ error: (e as Error).message }, { status: 400 });
	}
	if (!verification.verified || !verification.registrationInfo) {
		return NextResponse.json({ error: "Could not verify passkey." }, { status: 400 });
	}

	const { credential } = verification.registrationInfo;
	await connectToDatabase();
	if (await Passkey.findOne({ credentialId: credential.id })) {
		await clearChallenge();
		return NextResponse.json({ error: "Passkey already registered." }, { status: 409 });
	}
	await Passkey.create({
		userId: session.sub,
		credentialId: credential.id,
		publicKey: isoBase64URL.fromBuffer(credential.publicKey),
		counter: credential.counter,
		transports: credential.transports ?? response?.response?.transports ?? [],
		deviceName: deviceName || "Passkey",
	});
	await clearChallenge();
	return NextResponse.json({ ok: true });
}
