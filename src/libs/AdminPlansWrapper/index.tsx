"use client";

import { useState } from "react";
import { reorderedIds, useAdminCollection } from "@/libs/adminCollection";
import {
	AdminButton,
	AdminEmpty,
	AdminField,
	AdminInput,
	AdminModal,
	AdminNotice,
	AdminTable,
	AdminTextarea,
	AdminToggle,
	PageHeader,
} from "@/libs/adminUi";

type TStatus = "Published" | "Draft";

interface IPlanItem {
	id: string;
	name: string;
	priceLabel: string;
	blurb: string;
	features: string[];
	featured: boolean;
	ctaHref: string;
	status: TStatus;
}

interface IPlanForm {
	name: string;
	priceLabel: string;
	blurb: string;
	features: string;
	featured: boolean;
	ctaHref: string;
	status: TStatus;
}

const EMPTY: IPlanForm = {
	name: "",
	priceLabel: "",
	blurb: "",
	features: "",
	featured: false,
	ctaHref: "",
	status: "Draft",
};

export default function AdminPlansWrapper() {
	const { items, isLoading, create, update, remove, reorder } = useAdminCollection<IPlanItem>("plans");
	const [form, setForm] = useState<IPlanForm | null>(null);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [deleting, setDeleting] = useState<IPlanItem | null>(null);
	const [busy, setBusy] = useState(false);

	const openNew = () => {
		setEditingId(null);
		setForm(EMPTY);
	};
	const openEdit = (item: IPlanItem) => {
		setEditingId(item.id);
		setForm({
			name: item.name,
			priceLabel: item.priceLabel,
			blurb: item.blurb,
			features: item.features.join("\n"),
			featured: item.featured,
			ctaHref: item.ctaHref,
			status: item.status,
		});
	};

	const save = async () => {
		if (!form) return;
		setBusy(true);
		const payload = {
			name: form.name,
			priceLabel: form.priceLabel,
			blurb: form.blurb,
			features: form.features
				.split("\n")
				.map((line) => line.trim())
				.filter(Boolean),
			featured: form.featured,
			ctaHref: form.ctaHref,
			status: form.status,
		};
		try {
			if (editingId) await update(editingId, payload);
			else await create(payload);
			setForm(null);
		} finally {
			setBusy(false);
		}
	};

	const confirmDelete = async () => {
		if (!deleting) return;
		setBusy(true);
		try {
			await remove(deleting.id);
			setDeleting(null);
		} finally {
			setBusy(false);
		}
	};

	return (
		<>
			<PageHeader
				title="Coaching plans"
				subtitle="The ways to train shown on the public site."
				action={
					<AdminButton variant="primary" onClick={openNew}>
						Add plan
					</AdminButton>
				}
			/>

			{isLoading ? (
				<AdminNotice tone="info">Loading plans…</AdminNotice>
			) : items.length === 0 ? (
				<AdminEmpty
					title="No plans yet"
					description="Add your first coaching plan and it appears on the public site."
				>
					<AdminButton variant="primary" onClick={openNew}>
						Add your first plan
					</AdminButton>
				</AdminEmpty>
			) : (
				<AdminTable
					columns={["Plan", "Price", "Featured", "Shown", "Order", "Actions"]}
					head={
						<tr>
							<th>Plan</th>
							<th>Price</th>
							<th>Featured</th>
							<th>Shown</th>
							<th>Order</th>
							<th>Actions</th>
						</tr>
					}
				>
					{items.map((item, i) => (
						<tr key={item.id}>
							<td>{item.name}</td>
							<td>{item.priceLabel}</td>
							<td>{item.featured ? "Yes" : "No"}</td>
							<td>
								<AdminToggle
									checked={item.status === "Published"}
									label={item.status}
									onChange={(next) => update(item.id, { status: next ? "Published" : "Draft" })}
								/>
							</td>
							<td>
								<span className="cell-actions">
									<AdminButton
										variant="secondary"
										aria-label="Move up"
										disabled={i === 0}
										onClick={() => reorder(reorderedIds(items, i, -1))}
									>
										↑
									</AdminButton>
									<AdminButton
										variant="secondary"
										aria-label="Move down"
										disabled={i === items.length - 1}
										onClick={() => reorder(reorderedIds(items, i, 1))}
									>
										↓
									</AdminButton>
								</span>
							</td>
							<td>
								<span className="cell-actions">
									<AdminButton variant="secondary" onClick={() => openEdit(item)}>
										Edit
									</AdminButton>
									<AdminButton variant="secondary" onClick={() => setDeleting(item)}>
										Delete
									</AdminButton>
								</span>
							</td>
						</tr>
					))}
				</AdminTable>
			)}

			<AdminModal
				open={form !== null}
				title={editingId ? "Edit plan" : "Add plan"}
				confirmLabel="Save"
				onConfirm={save}
				onCancel={() => setForm(null)}
				busy={busy}
			>
				{form && (
					<>
						<AdminField label="Name" htmlFor="p-name" required>
							<AdminInput
								id="p-name"
								value={form.name}
								onChange={(e) => setForm({ ...form, name: e.target.value })}
							/>
						</AdminField>
						<AdminField label="Price" htmlFor="p-price" required hint="For example: £120/mo or From £7.99.">
							<AdminInput
								id="p-price"
								value={form.priceLabel}
								onChange={(e) => setForm({ ...form, priceLabel: e.target.value })}
							/>
						</AdminField>
						<AdminField label="Short description" htmlFor="p-blurb" required>
							<AdminTextarea
								id="p-blurb"
								value={form.blurb}
								onChange={(e) => setForm({ ...form, blurb: e.target.value })}
							/>
						</AdminField>
						<AdminField label="What's included" htmlFor="p-features" hint="One point per line.">
							<AdminTextarea
								id="p-features"
								value={form.features}
								onChange={(e) => setForm({ ...form, features: e.target.value })}
							/>
						</AdminField>
						<AdminField
							label="Button goes to"
							htmlFor="p-cta"
							hint="The page this plan's button opens, for example /online-coaching."
						>
							<AdminInput
								id="p-cta"
								value={form.ctaHref}
								onChange={(e) => setForm({ ...form, ctaHref: e.target.value })}
							/>
						</AdminField>
						<AdminToggle
							checked={form.featured}
							label="Highlight this plan"
							onChange={(next) => setForm({ ...form, featured: next })}
						/>
						<AdminToggle
							checked={form.status === "Published"}
							label="Show on the public site"
							onChange={(next) => setForm({ ...form, status: next ? "Published" : "Draft" })}
						/>
					</>
				)}
			</AdminModal>

			<AdminModal
				open={deleting !== null}
				title="Delete this plan?"
				confirmLabel="Delete"
				danger
				onConfirm={confirmDelete}
				onCancel={() => setDeleting(null)}
				busy={busy}
			>
				<p>“{deleting?.name}” will be removed from the public site. You can't undo this.</p>
			</AdminModal>
		</>
	);
}
