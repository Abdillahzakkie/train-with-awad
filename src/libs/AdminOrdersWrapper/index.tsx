"use client";

import { fetcher } from "@/constants";
import { AdminBadge, AdminEmpty, AdminNotice, AdminTable, PageHeader } from "@/libs/adminUi";
import useSWR from "swr";

interface IOrder {
	id: string;
	ebookSlug: string;
	email: string;
	amount: number;
	currency: string;
	stripeSessionId: string;
	createdAt: string;
	fulfilledAt?: string;
}

// Stripe stores amounts in minor units (pence); render them as money.
function formatMoney(amount: number, currency: string) {
	try {
		return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(amount / 100);
	} catch {
		return `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
	}
}

function formatWhen(iso: string) {
	return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminOrdersWrapper() {
	const { data, isLoading } = useSWR<{ items: IOrder[] }>("/api/admin/orders", fetcher);
	const items = data?.items ?? [];

	return (
		<>
			<PageHeader title="Orders" subtitle="Ebooks people have bought, newest first." />

			{isLoading ? (
				<AdminNotice tone="info">Loading orders…</AdminNotice>
			) : items.length === 0 ? (
				<AdminEmpty title="No orders yet" description="When someone buys an ebook, their order appears here." />
			) : (
				<AdminTable
					head={
						<tr>
							<th>Ebook</th>
							<th>Buyer</th>
							<th>Amount</th>
							<th>When</th>
							<th>Delivery</th>
						</tr>
					}
				>
					{items.map((order) => (
						<tr key={order.id}>
							<td>{order.ebookSlug}</td>
							<td>{order.email}</td>
							<td>{formatMoney(order.amount, order.currency)}</td>
							<td>{formatWhen(order.createdAt)}</td>
							<td>
								<AdminBadge tone={order.fulfilledAt ? "ok" : "warn"}>
									{order.fulfilledAt ? "Delivered" : "Pending"}
								</AdminBadge>
							</td>
						</tr>
					))}
				</AdminTable>
			)}
		</>
	);
}
