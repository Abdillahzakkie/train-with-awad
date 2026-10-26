"use client";

import { api, fetcher } from "@/constants";
import useSWR from "swr";

export interface IAdminItem {
	id: string;
}

/**
 * Read + write one admin collection against the /api/admin/<resource> contract.
 * Reads go through SWR; mutations use the one axios instance and revalidate.
 */
export function useAdminCollection<T extends IAdminItem>(resource: string) {
	const key = `/api/admin/${resource}`;
	const { data, isLoading, mutate } = useSWR<{ items: T[] }>(key, fetcher);
	const items = data?.items ?? [];

	const create = async (fields: Record<string, unknown>) => {
		await api().post(key, fields);
		await mutate();
	};
	const update = async (id: string, fields: Record<string, unknown>) => {
		await api().put(`${key}/${id}`, fields);
		await mutate();
	};
	const remove = async (id: string) => {
		await api().delete(`${key}/${id}`);
		await mutate();
	};
	const reorder = async (ids: string[]) => {
		await api().post(`${key}/reorder`, { ids });
		await mutate();
	};

	return { items, isLoading, mutate, create, update, remove, reorder };
}

// The id order after moving one item up (-1) or down (1). Out-of-range moves
// leave the order unchanged.
export function reorderedIds<T extends IAdminItem>(items: T[], index: number, dir: -1 | 1): string[] {
	const next = [...items];
	const target = index + dir;
	if (target < 0 || target >= next.length) return next.map((item) => item.id);
	[next[index], next[target]] = [next[target], next[index]];
	return next.map((item) => item.id);
}
