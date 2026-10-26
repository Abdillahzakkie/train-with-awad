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

interface IEbookItem {
	id: string;
	slug: string;
	title: string;
	blurb: string;
	priceGBP: number;
	cover: string;
	stripePriceId: string;
	status: TStatus;
}

interface IEbookForm {
	slug: string;
	title: string;
	blurb: string;
	priceGBP: string;
	cover: string;
	stripePriceId: string;
	status: TStatus;
}

const EMPTY: IEbookForm = {
	slug: "",
	title: "",
	blurb: "",
	priceGBP: "",
	cover: "",
	stripePriceId: "",
	status: "Draft",
};

const slugify = (value: string) =>
	value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");

export default function AdminEbooksWrapper() {
	const { items, isLoading, create, update, remove, reorder } = useAdminCollection<IEbookItem>("ebooks");
	const [form, setForm] = useState<IEbookForm | null>(null);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [deleting, setDeleting] = useState<IEbookItem | null>(null);
	const [busy, setBusy] = useState(false);

	const openNew = () => {
		setEditingId(null);
		setForm(EMPTY);
	};
	const openEdit = (item: IEbookItem) => {
		setEditingId(item.id);
		setForm({
			slug: item.slug,
			title: item.title,
			blurb: item.blurb,
			priceGBP: String(item.priceGBP),
			cover: item.cover,
			stripePriceId: item.stripePriceId,
			status: item.status,
		});
	};

	const save = async () => {
		if (!form) return;
		setBusy(true);
		const payload = {
			slug: form.slug.trim() || slugify(form.title),
			title: form.title,
			blurb: form.blurb,
			priceGBP: Number(form.priceGBP) || 0,
			cover: form.cover,
			stripePriceId: form.stripePriceId,
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
				title="Ebooks"
				subtitle="The ebooks sold on the public site."
				action={
					<AdminButton variant="primary" onClick={openNew}>
						Add ebook
					</AdminButton>
				}
			/>

			{isLoading ? (
				<AdminNotice tone="info">Loading ebooks…</AdminNotice>
			) : items.length === 0 ? (
				<AdminEmpty title="No ebooks yet" description="Add your first ebook and it appears in the public shop.">
					<AdminButton variant="primary" onClick={openNew}>
						Add your first ebook
					</AdminButton>
				</AdminEmpty>
			) : (
				<AdminTable
					head={
						<tr>
							<th>Ebook</th>
							<th>Price</th>
							<th>On sale</th>
							<th>Order</th>
							<th>Actions</th>
						</tr>
					}
				>
					{items.map((item, i) => (
						<tr key={item.id}>
							<td>{item.title}</td>
							<td>£{item.priceGBP.toFixed(2)}</td>
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
				title={editingId ? "Edit ebook" : "Add ebook"}
				confirmLabel="Save"
				onConfirm={save}
				onCancel={() => setForm(null)}
				busy={busy}
			>
				{form && (
					<>
						<AdminField label="Title" htmlFor="e-title" required>
							<AdminInput
								id="e-title"
								value={form.title}
								onChange={(e) => setForm({ ...form, title: e.target.value })}
							/>
						</AdminField>
						<AdminField
							label="Web address"
							htmlFor="e-slug"
							hint="The ending of the page link. Leave blank to build it from the title."
						>
							<AdminInput
								id="e-slug"
								value={form.slug}
								placeholder={slugify(form.title)}
								onChange={(e) => setForm({ ...form, slug: e.target.value })}
							/>
						</AdminField>
						<AdminField label="Short description" htmlFor="e-blurb" required>
							<AdminTextarea
								id="e-blurb"
								value={form.blurb}
								onChange={(e) => setForm({ ...form, blurb: e.target.value })}
							/>
						</AdminField>
						<AdminField label="Price in pounds" htmlFor="e-price" required hint="For example: 9.99.">
							<AdminInput
								id="e-price"
								type="number"
								min={0}
								step={0.01}
								value={form.priceGBP}
								onChange={(e) => setForm({ ...form, priceGBP: e.target.value })}
							/>
						</AdminField>
						<AdminField label="Cover image link" htmlFor="e-cover">
							<AdminInput
								id="e-cover"
								value={form.cover}
								onChange={(e) => setForm({ ...form, cover: e.target.value })}
							/>
						</AdminField>
						<AdminField
							label="Stripe price ID"
							htmlFor="e-stripe"
							hint="From your Stripe dashboard. It sets the amount a buyer is charged."
						>
							<AdminInput
								id="e-stripe"
								value={form.stripePriceId}
								onChange={(e) => setForm({ ...form, stripePriceId: e.target.value })}
							/>
						</AdminField>
						<AdminToggle
							checked={form.status === "Published"}
							label="On sale in the public shop"
							onChange={(next) => setForm({ ...form, status: next ? "Published" : "Draft" })}
						/>
					</>
				)}
			</AdminModal>

			<AdminModal
				open={deleting !== null}
				title="Delete this ebook?"
				confirmLabel="Delete"
				danger
				onConfirm={confirmDelete}
				onCancel={() => setDeleting(null)}
				busy={busy}
			>
				<p>“{deleting?.title}” will be removed from the public shop. You can't undo this.</p>
			</AdminModal>
		</>
	);
}
