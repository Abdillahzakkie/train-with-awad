"use client";

import { startRegistration } from "@simplewebauthn/browser";
import { useState } from "react";
import useSWR from "swr";
import { api, fetcher } from "@/constants";
import { AdminButton, AdminCard, AdminModal, AdminNotice, PageHeader } from "@/libs/adminUi";
import { IntroStyled, PasskeyListStyled } from "./styled";

interface IPasskey {
	id: string;
	deviceName: string;
	createdAt: string;
}

function formatWhen(iso: string): string {
	return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// A friendly default name for the device being registered, from the browser and
// platform, so a person doesn't have to name it.
function deviceLabel(): string {
	const ua = typeof navigator === "undefined" ? "" : navigator.userAgent;
	const os = /Mac/.test(ua)
		? "Mac"
		: /Windows/.test(ua)
			? "Windows"
			: /Android/.test(ua)
				? "Android"
				: /iPhone|iPad/.test(ua)
					? "iPhone or iPad"
					: /Linux/.test(ua)
						? "Linux"
						: "this device";
	const browser = /Edg/.test(ua)
		? "Edge"
		: /Chrome/.test(ua)
			? "Chrome"
			: /Firefox/.test(ua)
				? "Firefox"
				: /Safari/.test(ua)
					? "Safari"
					: "browser";
	return `${browser} on ${os}`;
}

export default function AdminSettingsWrapper() {
	const { data, isLoading, mutate } = useSWR<{ items: IPasskey[] }>("/api/admin/passkeys", fetcher);
	const passkeys = data?.items ?? [];

	const [adding, setAdding] = useState(false);
	const [error, setError] = useState("");
	const [notice, setNotice] = useState("");
	const [removing, setRemoving] = useState<IPasskey | null>(null);
	const [busy, setBusy] = useState(false);

	const addDevice = async () => {
		setError("");
		setNotice("");
		setAdding(true);
		try {
			const optionsRes = await fetch("/api/auth/passkey/register/options", { method: "POST" });
			if (!optionsRes.ok) throw new Error("options");
			const options = await optionsRes.json();
			const response = await startRegistration({ optionsJSON: options });
			const verifyRes = await fetch("/api/auth/passkey/register/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ response, deviceName: deviceLabel() }),
			});
			if (!verifyRes.ok) {
				const body = await verifyRes.json().catch(() => null);
				setError(
					body?.error === "Passkey already registered."
						? "This device already has a passkey."
						: "That didn't work. Try adding the passkey again.",
				);
				return;
			}
			setNotice("Passkey added. You can sign in with this device from now on.");
			await mutate();
		} catch (e) {
			// Dismissing the device prompt throws NotAllowedError — not an error.
			if ((e as Error).name !== "NotAllowedError") {
				setError("Passkeys aren't available on this device or browser.");
			}
		} finally {
			setAdding(false);
		}
	};

	const confirmRemove = async () => {
		if (!removing) return;
		setBusy(true);
		try {
			await api().delete(`/api/admin/passkeys/${removing.id}`);
			await mutate();
			setRemoving(null);
		} catch {
			setError("Couldn't remove that passkey. Try again.");
		} finally {
			setBusy(false);
		}
	};

	const lastOne = passkeys.length === 1;

	return (
		<>
			<PageHeader title="Settings" subtitle="Manage how you sign in to the admin." />

			{error && (
				<AdminNotice tone="danger" onDismiss={() => setError("")}>
					{error}
				</AdminNotice>
			)}
			{notice && (
				<AdminNotice tone="ok" onDismiss={() => setNotice("")}>
					{notice}
				</AdminNotice>
			)}

			<AdminCard title="Passkeys">
				<IntroStyled>
					A passkey lets you sign in with your fingerprint or face instead of a password. Add one for each
					device you use to sign in.
				</IntroStyled>

				{isLoading ? (
					<AdminNotice tone="info">Loading passkeys…</AdminNotice>
				) : passkeys.length === 0 ? (
					<AdminNotice tone="info">
						No passkeys yet. Add this device to sign in with your fingerprint or face.
					</AdminNotice>
				) : (
					<PasskeyListStyled>
						{passkeys.map((passkey) => (
							<li key={passkey.id}>
								<span>
									<span className="pk-name">{passkey.deviceName}</span>
									<br />
									<span className="pk-when">Added {formatWhen(passkey.createdAt)}</span>
								</span>
								<AdminButton variant="danger" onClick={() => setRemoving(passkey)}>
									Remove
								</AdminButton>
							</li>
						))}
					</PasskeyListStyled>
				)}

				<AdminButton variant="primary" onClick={addDevice} disabled={adding}>
					{adding ? "Waiting for your device…" : "Add this device"}
				</AdminButton>
			</AdminCard>

			<AdminModal
				open={removing !== null}
				title="Remove this passkey?"
				confirmLabel="Remove"
				cancelLabel="Keep"
				danger
				busy={busy}
				onConfirm={confirmRemove}
				onCancel={() => setRemoving(null)}
			>
				{removing &&
					(lastOne
						? "This is your only passkey. Remove it and you'll sign in with your email and password until you add another."
						: `You'll no longer be able to sign in with “${removing.deviceName}”.`)}
			</AdminModal>
		</>
	);
}
