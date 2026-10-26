"use client";

import { useState } from "react";
import useSWR from "swr";
import { api, fetcher } from "@/constants";
import {
	AdminBadge,
	AdminButton,
	AdminField,
	AdminInput,
	AdminModal,
	AdminNotice,
	AdminSelect,
	AdminTable,
	AdminToggle,
	PageHeader,
} from "@/libs/adminUi";

type TRole = "Owner" | "Editor" | "Viewer";
const ROLES: TRole[] = ["Owner", "Editor", "Viewer"];

interface IMember {
	id: string;
	name: string;
	email: string;
	role: TRole | null;
	status: "active" | "disabled";
	createdAt: string;
}

interface IInvite {
	name: string;
	email: string;
	role: TRole;
	password: string;
}

function errMessage(err: unknown): string {
	const e = err as { response?: { data?: { error?: string } } };
	return e?.response?.data?.error ?? "Something went wrong. Try again.";
}

export default function AdminTeamWrapper() {
	const { data, isLoading, mutate } = useSWR<{ items: IMember[] }>("/api/admin/team", fetcher);
	const members = data?.items ?? [];
	const [notice, setNotice] = useState("");
	const [removing, setRemoving] = useState<IMember | null>(null);
	const [invite, setInvite] = useState<IInvite | null>(null);
	const [inviteError, setInviteError] = useState("");
	const [busy, setBusy] = useState(false);

	// Run a mutation, surface any refusal (such as the last-owner guard) as a
	// friendly notice, and resync with the server either way.
	const run = async (fn: () => Promise<void>) => {
		setNotice("");
		try {
			await fn();
		} catch (err) {
			setNotice(errMessage(err));
		} finally {
			await mutate();
		}
	};

	const changeRole = (member: IMember, role: TRole) =>
		run(async () => {
			await api().patch(`/api/admin/team/${member.id}`, { role });
		});

	const changeStatus = (member: IMember, active: boolean) =>
		run(async () => {
			await api().patch(`/api/admin/team/${member.id}`, { status: active ? "active" : "disabled" });
		});

	const confirmRemove = async () => {
		if (!removing) return;
		setBusy(true);
		setNotice("");
		try {
			await api().delete(`/api/admin/team/${removing.id}`);
			setRemoving(null);
		} catch (err) {
			setNotice(errMessage(err));
			setRemoving(null);
		} finally {
			setBusy(false);
			await mutate();
		}
	};

	const sendInvite = async () => {
		if (!invite) return;
		setBusy(true);
		setInviteError("");
		try {
			await api().post("/api/admin/team", invite);
			setInvite(null);
			await mutate();
		} catch (err) {
			setInviteError(errMessage(err));
		} finally {
			setBusy(false);
		}
	};

	return (
		<>
			<PageHeader
				title="Team & access"
				subtitle="Who can sign in to the admin, and what each person can do."
				action={
					<AdminButton
						variant="primary"
						onClick={() => setInvite({ name: "", email: "", role: "Viewer", password: "" })}
					>
						Invite teammate
					</AdminButton>
				}
			/>

			{notice && (
				<AdminNotice tone="warn" onDismiss={() => setNotice("")}>
					{notice}
				</AdminNotice>
			)}

			{isLoading ? (
				<AdminNotice tone="info">Loading your team…</AdminNotice>
			) : (
				<AdminTable
					columns={["Name", "Email", "Role", "Can sign in", "Actions"]}
					head={
						<tr>
							<th>Name</th>
							<th>Email</th>
							<th>Role</th>
							<th>Can sign in</th>
							<th>Actions</th>
						</tr>
					}
				>
					{members.map((member) => (
						<tr key={member.id}>
							<td>{member.name}</td>
							<td>{member.email}</td>
							<td>
								<AdminSelect
									ariaLabel={`Role for ${member.name}`}
									value={member.role ?? ""}
									onChange={(v) => changeRole(member, v as TRole)}
									options={ROLES.map((role) => ({ value: role, label: role }))}
									placeholder="—"
								/>
							</td>
							<td>
								<AdminToggle
									checked={member.status === "active"}
									label={member.status === "active" ? "Active" : "Disabled"}
									onChange={(active) => changeStatus(member, active)}
								/>
							</td>
							<td>
								<AdminButton variant="secondary" onClick={() => setRemoving(member)}>
									Remove
								</AdminButton>
							</td>
						</tr>
					))}
				</AdminTable>
			)}

			<AdminModal
				open={invite !== null}
				title="Invite teammate"
				confirmLabel="Send invite"
				onConfirm={sendInvite}
				onCancel={() => setInvite(null)}
				busy={busy}
			>
				{invite && (
					<>
						{inviteError && <AdminNotice tone="danger">{inviteError}</AdminNotice>}
						<AdminField label="Name" htmlFor="tm-name">
							<AdminInput
								id="tm-name"
								value={invite.name}
								onChange={(e) => setInvite({ ...invite, name: e.target.value })}
							/>
						</AdminField>
						<AdminField label="Email" htmlFor="tm-email" required>
							<AdminInput
								id="tm-email"
								type="email"
								autoComplete="off"
								value={invite.email}
								onChange={(e) => setInvite({ ...invite, email: e.target.value })}
							/>
						</AdminField>
						<AdminField label="Role" htmlFor="tm-role" required>
							<AdminSelect
								id="tm-role"
								value={invite.role}
								onChange={(v) => setInvite({ ...invite, role: v as TRole })}
								options={ROLES.map((role) => ({ value: role, label: role }))}
							/>
						</AdminField>
						<AdminField
							label="Temporary password"
							htmlFor="tm-pass"
							required
							hint="Share it with your teammate. They sign in with it, then add a passkey."
						>
							<AdminInput
								id="tm-pass"
								type="text"
								autoComplete="off"
								value={invite.password}
								onChange={(e) => setInvite({ ...invite, password: e.target.value })}
							/>
						</AdminField>
					</>
				)}
			</AdminModal>

			<AdminModal
				open={removing !== null}
				title="Remove this teammate?"
				confirmLabel="Remove"
				danger
				onConfirm={confirmRemove}
				onCancel={() => setRemoving(null)}
				busy={busy}
			>
				<p>
					{removing?.name} will lose access to the admin straight away. You can't undo this, but you can
					invite them again later.
				</p>
			</AdminModal>
		</>
	);
}
