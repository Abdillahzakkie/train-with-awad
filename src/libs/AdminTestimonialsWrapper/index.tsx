"use client";

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
import { useState } from "react";

type TStatus = "Published" | "Draft";

interface ITestimonialItem {
	id: string;
	name: string;
	quote: string;
	detail?: string;
	rating?: number;
	status: TStatus;
}

interface ITestimonialForm {
	name: string;
	quote: string;
	detail: string;
	rating: string;
	status: TStatus;
}

const EMPTY: ITestimonialForm = { name: "", quote: "", detail: "", rating: "", status: "Draft" };

export default function AdminTestimonialsWrapper() {
	const { items, isLoading, create, update, remove, reorder } = useAdminCollection<ITestimonialItem>("testimonials");
	const [form, setForm] = useState<ITestimonialForm | null>(null);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [deleting, setDeleting] = useState<ITestimonialItem | null>(null);
	const [busy, setBusy] = useState(false);

	const openNew = () => {
		setEditingId(null);
		setForm(EMPTY);
	};
	const openEdit = (item: ITestimonialItem) => {
		setEditingId(item.id);
		setForm({
			name: item.name,
			quote: item.quote,
			detail: item.detail ?? "",
			rating: item.rating ? String(item.rating) : "",
			status: item.status,
		});
	};

	const save = async () => {
		if (!form) return;
		setBusy(true);
		const payload = {
			name: form.name,
			quote: form.quote,
			detail: form.detail.trim() || undefined,
			rating: form.rating ? Number(form.rating) : undefined,
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
				title="Testimonials"
				subtitle="Client stories shown on the public testimonials page."
				action={
					<AdminButton variant="primary" onClick={openNew}>
						Add testimonial
					</AdminButton>
				}
			/>

			{isLoading ? (
				<AdminNotice tone="info">Loading testimonials…</AdminNotice>
			) : items.length === 0 ? (
				<AdminEmpty
					title="No testimonials yet"
					description="Add your first client story and it appears on the public testimonials page."
				>
					<AdminButton variant="primary" onClick={openNew}>
						Add your first testimonial
					</AdminButton>
				</AdminEmpty>
			) : (
				<AdminTable
					head={
						<tr>
							<th>From</th>
							<th>Rating</th>
							<th>Shown</th>
							<th>Order</th>
							<th>Actions</th>
						</tr>
					}
				>
					{items.map((item, i) => (
						<tr key={item.id}>
							<td>{item.name}</td>
							<td>{item.rating ? `${item.rating} of 5` : "—"}</td>
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
				title={editingId ? "Edit testimonial" : "Add testimonial"}
				confirmLabel="Save"
				onConfirm={save}
				onCancel={() => setForm(null)}
				busy={busy}
			>
				{form && (
					<>
						<AdminField label="Name" htmlFor="t-name" required>
							<AdminInput
								id="t-name"
								value={form.name}
								onChange={(e) => setForm({ ...form, name: e.target.value })}
							/>
						</AdminField>
						<AdminField label="What they said" htmlFor="t-quote" required>
							<AdminTextarea
								id="t-quote"
								value={form.quote}
								onChange={(e) => setForm({ ...form, quote: e.target.value })}
							/>
						</AdminField>
						<AdminField label="Detail" htmlFor="t-detail" hint="For example: Online coaching · 14 months.">
							<AdminInput
								id="t-detail"
								value={form.detail}
								onChange={(e) => setForm({ ...form, detail: e.target.value })}
							/>
						</AdminField>
						<AdminField label="Rating out of 5" htmlFor="t-rating" hint="Leave blank to show no rating.">
							<AdminInput
								id="t-rating"
								type="number"
								min={1}
								max={5}
								value={form.rating}
								onChange={(e) => setForm({ ...form, rating: e.target.value })}
							/>
						</AdminField>
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
				title="Delete this testimonial?"
				confirmLabel="Delete"
				danger
				onConfirm={confirmDelete}
				onCancel={() => setDeleting(null)}
				busy={busy}
			>
				<p>The testimonial from {deleting?.name} will be removed from the public site. You can't undo this.</p>
			</AdminModal>
		</>
	);
}
