import { startSession } from "@/server/auth";
import { connectToDatabase } from "@/server/db/connect";
import { AdminUser } from "@/server/models/AdminUser";
import { Passkey } from "@/server/models/Passkey";
import { clearChallenge, getChallenge, origin, rpID } from "@/server/webauthn";
import { type AuthenticatorTransportFuture, verifyAuthenticationResponse } from "@simplewebauthn/server";
import { isoBase64URL } from "@simplewebauthn/server/helpers";
import { NextResponse } from "next/server";

const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });

export async function POST(req: Request) {
	const { response } = await req.json();
	if (!response?.id) return unauthorized();
	const expectedChallenge = await getChallenge();
	if (!expectedChallenge) return unauthorized();

	await connectToDatabase();
	const passkey = await Passkey.findOne({ credentialId: response.id });
	if (!passkey) return unauthorized();
	const user = await AdminUser.findById(passkey.userId);
	if (!user || user.status === "disabled") return unauthorized();

	let verification: Awaited<ReturnType<typeof verifyAuthenticationResponse>>;
	try {
		verification = await verifyAuthenticationResponse({
			response,
			expectedChallenge,
			expectedOrigin: origin,
			expectedRPID: rpID,
			credential: {
				id: passkey.credentialId,
				publicKey: isoBase64URL.toBuffer(passkey.publicKey),
				counter: passkey.counter,
				transports: passkey.transports as AuthenticatorTransportFuture[],
			},
		});
	} catch {
		return unauthorized();
	}
	if (!verification.verified) return unauthorized();

	passkey.counter = verification.authenticationInfo.newCounter;
	await passkey.save();
	await startSession({ sub: String(user._id), email: user.email });
	await clearChallenge();
	return NextResponse.json({ ok: true });
}
