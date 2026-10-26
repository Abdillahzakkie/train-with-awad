"use client";

import { startAuthentication } from "@simplewebauthn/browser";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import { AdminButton, AdminField, AdminInput, AdminNotice } from "@/libs/adminUi";
import { SignCard, SignInShell } from "./styled";

// Passkey-first sign-in: one big primary action, with email and password as a
// collapsible fallback.
export default function AdminSignInWrapper({ logoUrl }: { logoUrl: string }) {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [busy, setBusy] = useState(false);

	const goNext = () => {
		const next = new URLSearchParams(window.location.search).get("next");
		router.push(next?.startsWith("/admin") ? next : "/admin");
	};

	const signInWithPasskey = async () => {
		setBusy(true);
		setError("");
		try {
			const optionsRes = await fetch("/api/auth/passkey/authenticate/options", { method: "POST" });
			if (!optionsRes.ok) throw new Error("options");
			const { options } = await optionsRes.json();
			const response = await startAuthentication({ optionsJSON: options });
			const verifyRes = await fetch("/api/auth/passkey/authenticate/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ response }),
			});
			if (!verifyRes.ok) {
				setError("That passkey was not recognised. Try again, or use your email and password.");
				return;
			}
			goNext();
		} catch (e) {
			// A person who dismisses the prompt throws NotAllowedError — not worth an error.
			if ((e as Error).name !== "NotAllowedError") {
				setError("Passkeys are not available on this device. Use your email and password instead.");
				setShowPassword(true);
			}
		} finally {
			setBusy(false);
		}
	};

	const signInWithPassword = async () => {
		setBusy(true);
		setError("");
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			if (!res.ok) {
				setError("That email and password did not match. Check them and try again.");
				return;
			}
			goNext();
		} catch {
			setError("Could not reach the server. Check your connection and try again.");
		} finally {
			setBusy(false);
		}
	};

	return (
		<SignInShell>
			<SignCard>
				<div className="brand">
					<BrandLogo src={logoUrl} height={32} />
				</div>
				<div>
					<h1>Sign in to the admin</h1>
					<p className="lede">Manage your pages, ebooks, enquiries, and orders.</p>
				</div>

				{error && <AdminNotice tone="danger">{error}</AdminNotice>}

				<AdminButton variant="primary" size="lg" block onClick={signInWithPasskey} disabled={busy}>
					{busy ? "Signing in…" : "Sign in with a passkey"}
				</AdminButton>
				<p className="passkey-hint">
					A passkey signs you in with your fingerprint, face, or device PIN — no password to remember.
				</p>

				{!showPassword && (
					<button type="button" className="alt" onClick={() => setShowPassword(true)}>
						Use email and password instead
					</button>
				)}

				{showPassword && (
					<div className="pw-form">
						<AdminField label="Email" htmlFor="si-email" required>
							<AdminInput
								id="si-email"
								type="email"
								autoComplete="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</AdminField>
						<AdminField label="Password" htmlFor="si-password" required>
							<AdminInput
								id="si-password"
								type="password"
								autoComplete="current-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") signInWithPassword();
								}}
							/>
						</AdminField>
						<AdminButton variant="secondary" size="lg" block onClick={signInWithPassword} disabled={busy}>
							{busy ? "Signing in…" : "Sign in"}
						</AdminButton>
					</div>
				)}
			</SignCard>
		</SignInShell>
	);
}
