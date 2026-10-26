"use client";

import { useState } from "react";
import { reorderedIds, useAdminCollection } from "@/libs/adminCollection";
import {
	AdminButton,
	AdminEmpty,
	AdminField,
	AdminModal,
	AdminNotice,
	AdminTable,
	AdminTextarea,
	AdminToggle,
	PageHeader,
} from "@/libs/adminUi";

type TStatus = "Published" | "Draft";

interface IFaqItem {
	id: string;
	question: string;
	answer: string;
	status: TStatus;
}

interface IFaqForm {
	question: string;
	answer: string;
	status: TStatus;
}

const EMPTY: IFaqForm = { question: "", answer: "", status: "Draft" };

export default function AdminFaqWrapper() {
	const { items, isLoading, create, update, remove, reorder } = useAdminCollection<IFaqItem>("faq");
	const [form, setForm] = useState<IFaqForm | null>(null);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [deleting, setDeleting] = useState<IFaqItem | null>(null);
	const [busy, setBusy] = useState(false);

	const openNew = () => {
		setEditingId(null);
		setForm(EMPTY);
	};
	const openEdit = (item: IFaqItem) => {
		setEditingId(item.id);
		setForm({ question: item.question, answer: item.answer, status: item.status });
	};

	const save = async () => {
		if (!form) return;
		setBusy(true);
		try {
			if (editingId) await update(editingId, { ...form });
			else await create({ ...form });
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
				title="FAQ"
				subtitle="Questions and answers shown on the public FAQ page."
				action={
					<AdminButton variant="primary" onClick={openNew}>
						Add question
					</AdminButton>
				}
			/>

			{isLoading ? (
				<AdminNotice tone="info">Loading questions…</AdminNotice>
			) : items.length === 0 ? (
				<AdminEmpty
					title="No questions yet"
					description="Add your first question and it appears on the public FAQ page."
				>
					<AdminButton variant="primary" onClick={openNew}>
						Add your first question
					</AdminButton>
				</AdminEmpty>
			) : (
				<AdminTable
					columns={["Question", "Shown", "Order", "Actions"]}
					head={
						<tr>
							<th>Question</th>
							<th>Shown</th>
							<th>Order</th>
							<th>Actions</th>
						</tr>
					}
				>
					{items.map((item, i) => (
						<tr key={item.id}>
							<td>{item.question}</td>
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
				title={editingId ? "Edit question" : "Add question"}
				confirmLabel="Save"
				onConfirm={save}
				onCancel={() => setForm(null)}
				busy={busy}
			>
				{form && (
					<>
						<AdminField label="Question" htmlFor="faq-q" required>
							<AdminTextarea
								id="faq-q"
								value={form.question}
								onChange={(e) => setForm({ ...form, question: e.target.value })}
							/>
						</AdminField>
						<AdminField label="Answer" htmlFor="faq-a" required>
							<AdminTextarea
								id="faq-a"
								value={form.answer}
								onChange={(e) => setForm({ ...form, answer: e.target.value })}
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
				title="Delete this question?"
				confirmLabel="Delete"
				danger
				onConfirm={confirmDelete}
				onCancel={() => setDeleting(null)}
				busy={busy}
			>
				<p>“{deleting?.question}” will be removed from the public FAQ page. You can't undo this.</p>
			</AdminModal>
		</>
	);
}
