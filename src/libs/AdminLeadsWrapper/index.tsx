"use client";

import { api } from "@/constants";
import { useAdminCollection } from "@/libs/adminCollection";
import {
	AdminBadge,
	AdminButton,
	AdminEmpty,
	AdminModal,
	AdminNotice,
	AdminTable,
	PageHeader,
	type TTone,
} from "@/libs/adminUi";
import { useState } from "react";

type TLeadStatus = "New" | "Handled";

interface ILead {
	id: string;
	name: string;
	email: string;
	phone?: string;
	mode: "online" | "in-person";
	goal?: string;
	source?: string;
	status: TLeadStatus;
	createdAt: string;
}

const MODE_LABEL: Record<ILead["mode"], string> = {
	online: "Online coaching",
	"in-person": "In-person coaching",
};

const statusTone = (status: TLeadStatus): TTone => (status === "New" ? "warn" : "ok");

function formatWhen(iso: string) {
	return new Date(iso).toLocaleString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export default function AdminLeadsWrapper() {
	const { items, isLoading, mutate } = useAdminCollection<ILead>("leads");
	const [viewing, setViewing] = useState<ILead | null>(null);
	const [busy, setBusy] = useState(false);

	const toggleStatus = async (lead: ILead) => {
		const next: TLeadStatus = lead.status === "New" ? "Handled" : "New";
		setBusy(true);
		try {
			await api().patch(`/api/admin/leads/${lead.id}`, { status: next });
			await mutate();
			setViewing({ ...lead, status: next });
		} finally {
			setBusy(false);
		}
	};

	return (
		<>
			<PageHeader title="Enquiries" subtitle="People who asked to book a free call, newest first." />

			{isLoading ? (
				<AdminNotice tone="info">Loading enquiries…</AdminNotice>
			) : items.length === 0 ? (
				<AdminEmpty
					title="No enquiries yet"
					description="When someone sends the contact form, their enquiry appears here."
				/>
			) : (
				<AdminTable
					head={
						<tr>
							<th>From</th>
							<th>When</th>
							<th>Wants</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
					}
				>
					{items.map((lead) => (
						<tr key={lead.id}>
							<td>{lead.name}</td>
							<td>{formatWhen(lead.createdAt)}</td>
							<td>{MODE_LABEL[lead.mode]}</td>
							<td>
								<AdminBadge tone={statusTone(lead.status)}>{lead.status}</AdminBadge>
							</td>
							<td>
								<AdminButton variant="secondary" onClick={() => setViewing(lead)}>
									Open
								</AdminButton>
							</td>
						</tr>
					))}
				</AdminTable>
			)}

			<AdminModal
				open={viewing !== null}
				title={viewing ? `Enquiry from ${viewing.name}` : ""}
				confirmLabel={viewing?.status === "New" ? "Mark as handled" : "Reopen"}
				cancelLabel="Close"
				onConfirm={() => viewing && toggleStatus(viewing)}
				onCancel={() => setViewing(null)}
				busy={busy}
			>
				{viewing && (
					<>
						<p>
							<strong>Email:</strong> {viewing.email}
						</p>
						<p>
							<strong>Phone:</strong> {viewing.phone || "Not given"}
						</p>
						<p>
							<strong>Wants:</strong> {MODE_LABEL[viewing.mode]}
						</p>
						<p>
							<strong>Goal:</strong> {viewing.goal || "Not given"}
						</p>
						<p>
							<strong>Sent:</strong> {formatWhen(viewing.createdAt)}
						</p>
						{viewing.source && (
							<p>
								<strong>From page:</strong> {viewing.source}
							</p>
						)}
						<p>
							<strong>Status:</strong> {viewing.status}
						</p>
					</>
				)}
			</AdminModal>
		</>
	);
}
