"use client";

import { api } from "@/constants";
import {
	AdminButton,
	AdminCard,
	AdminField,
	AdminInput,
	AdminNotice,
	AdminSelect,
	AdminTextarea,
	AdminToggle,
	PageHeader,
} from "@/libs/adminUi";
import type { ISiteSection, SiteContentData } from "@/types";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { ArrayGroupStyled, EditorStyled, FieldsStyled, PickerStyled, SectionHeadStyled } from "./styled";

interface IProps {
	// The current content, read server-side and passed in so the editor opens
	// filled rather than empty. Saving PUTs the whole edited copy back.
	initial: SiteContentData;
}

type TStatus = "idle" | "saving" | "saved" | "error";

// Friendly page names for the picker, in the order a person reads the site.
const PAGE_LABELS: Record<string, string> = {
	home: "Home",
	about: "About",
	"online-coaching": "Online coaching",
	"in-person-coaching": "In-person coaching",
	legal: "Legal",
	testimonials: "Testimonials",
	faq: "FAQ",
	contact: "Contact",
};
const PAGE_ORDER = Object.keys(PAGE_LABELS);

// A plain name for each section type, so a person sees "Intro", not "hero".
const SECTION_NAMES: Record<string, string> = {
	hero: "Intro",
	plans: "Ways to train",
	steps: "How it works",
	ebookTeaser: "Ebook teaser",
	quotes: "Testimonials list",
	faqList: "FAQ list",
	contactForm: "Contact form",
	features: "Features",
	stats: "Stats",
	priceCard: "Price card",
	legalBody: "Legal body",
};

// Readable labels for the common field keys; anything else is humanised.
const FIELD_LABELS: Record<string, string> = {
	eyebrow: "Eyebrow",
	title: "Title",
	lede: "Intro line",
	sub: "Subtitle",
	body: "Body text",
	ctaLabel: "Button label",
	ctaHref: "Button link",
	priceLabel: "Price",
	updated: "Last updated",
	heading: "Heading",
	value: "Number",
	label: "Label",
	name: "Name",
	note: "Note",
};

function humanise(key: string) {
	const words = key.replace(/-/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2");
	return words.charAt(0).toUpperCase() + words.slice(1);
}
function fieldLabel(key: string) {
	return FIELD_LABELS[key] ?? humanise(key);
}
function singular(key: string) {
	return fieldLabel(key.endsWith("s") ? key.slice(0, -1) : key);
}
function sectionName(type: string) {
	return SECTION_NAMES[type] ?? humanise(type);
}

export default function AdminContentWrapper({ initial }: IProps) {
	const [content, setContent] = useState<SiteContentData>(() => structuredClone(initial));
	const [status, setStatus] = useState<TStatus>("idle");
	const [open, setOpen] = useState<Record<string, boolean>>({});

	// Pages in reading order, with any unlisted page appended.
	const slugs = useMemo(() => {
		const known = PAGE_ORDER.filter((s) => s in content.pages);
		const extra = Object.keys(content.pages).filter((s) => !PAGE_ORDER.includes(s));
		return [...known, ...extra];
	}, [content.pages]);

	const [slug, setSlug] = useState(() => {
		const known = PAGE_ORDER.filter((s) => s in initial.pages);
		return known[0] ?? Object.keys(initial.pages)[0] ?? "";
	});

	const page = content.pages[slug];

	/** Edit the draft through a mutating updater on a structured clone. */
	function mutate(fn: (draft: SiteContentData) => void) {
		setStatus("idle");
		setContent((prev) => {
			const next = structuredClone(prev);
			fn(next);
			return next;
		});
	}

	/** Set one string field inside a section, addressed by its path in `fields`. */
	function editField(sectionId: string, path: (string | number)[], value: string) {
		mutate((d) => {
			const section = d.pages[slug]?.sections.find((s) => s.id === sectionId);
			if (!section) return;
			// biome-ignore lint/suspicious/noExplicitAny: walking a free-form fields tree by path.
			let node: any = section.fields;
			for (let i = 0; i < path.length - 1; i++) node = node[path[i]];
			node[path[path.length - 1]] = value;
		});
	}

	function setVisible(sectionId: string, visible: boolean) {
		mutate((d) => {
			const s = d.pages[slug]?.sections.find((x) => x.id === sectionId);
			if (s) s.visible = visible;
		});
	}

	/** Move a section up or down by swapping its order with its neighbour's. */
	function move(sectionId: string, dir: "up" | "down") {
		mutate((d) => {
			const sorted = [...(d.pages[slug]?.sections ?? [])].sort((a, b) => a.order - b.order);
			const i = sorted.findIndex((s) => s.id === sectionId);
			const j = dir === "up" ? i - 1 : i + 1;
			if (i < 0 || j < 0 || j >= sorted.length) return;
			const tmp = sorted[i].order;
			sorted[i].order = sorted[j].order;
			sorted[j].order = tmp;
		});
	}

	async function save() {
		setStatus("saving");
		try {
			await api().put("/api/admin/content", { data: content });
			setStatus("saved");
		} catch {
			setStatus("error");
		}
	}

	function renderValue(sectionId: string, path: (string | number)[], value: unknown): ReactNode {
		const key = String(path[path.length - 1]);
		const id = `${sectionId}-${path.join("-")}`;

		if (typeof value === "string") {
			const long = value.length > 60;
			return (
				<AdminField key={id} label={fieldLabel(key)} htmlFor={id}>
					{long ? (
						<AdminTextarea
							id={id}
							rows={3}
							value={value}
							onChange={(e) => editField(sectionId, path, e.target.value)}
						/>
					) : (
						<AdminInput
							id={id}
							value={value}
							onChange={(e) => editField(sectionId, path, e.target.value)}
						/>
					)}
				</AdminField>
			);
		}

		if (Array.isArray(value)) {
			return (
				<ArrayGroupStyled key={id}>
					<span className="legend">{fieldLabel(key)}</span>
					{value.map((item, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: list order is fixed; items are not reordered here.
						<div className="item" key={i}>
							<span className="item-label">
								{singular(key)} {i + 1}
							</span>
							{item && typeof item === "object"
								? Object.entries(item as Record<string, unknown>).map(([k, v]) =>
										renderValue(sectionId, [...path, i, k], v),
									)
								: null}
						</div>
					))}
				</ArrayGroupStyled>
			);
		}

		// Numbers, booleans, and nested objects are left untouched and round-trip
		// unchanged on save; the editor only exposes text.
		return null;
	}

	function renderSection(section: ISiteSection) {
		const isOpen = open[section.id] ?? false;
		const title = typeof section.fields.title === "string" ? section.fields.title : undefined;
		const fieldKeys = Object.keys(section.fields);

		return (
			<AdminCard key={section.id}>
				<SectionHeadStyled data-hidden={!section.visible}>
					<div className="meta">
						<span className="name">{sectionName(section.type)}</span>
						{title && <span className="hint">{title}</span>}
					</div>
					<div className="controls">
						<AdminButton
							aria-label={`Move ${sectionName(section.type)} up`}
							onClick={() => move(section.id, "up")}
						>
							Up
						</AdminButton>
						<AdminButton
							aria-label={`Move ${sectionName(section.type)} down`}
							onClick={() => move(section.id, "down")}
						>
							Down
						</AdminButton>
						<AdminToggle
							label="Shown on site"
							checked={section.visible}
							onChange={(next) => setVisible(section.id, next)}
						/>
						<AdminButton
							variant="secondary"
							aria-expanded={isOpen}
							onClick={() => setOpen((o) => ({ ...o, [section.id]: !isOpen }))}
						>
							{isOpen ? "Close" : "Edit text"}
						</AdminButton>
					</div>
				</SectionHeadStyled>

				{isOpen && (
					<FieldsStyled>
						{fieldKeys.length === 0 ? (
							<AdminNotice tone="info">This list is edited on its own page.</AdminNotice>
						) : (
							fieldKeys.map((key) => renderValue(section.id, [key], section.fields[key]))
						)}
					</FieldsStyled>
				)}
			</AdminCard>
		);
	}

	if (!page) {
		return <AdminNotice tone="danger">No content to edit.</AdminNotice>;
	}

	const sections = [...page.sections].sort((a, b) => a.order - b.order);

	return (
		<EditorStyled>
			<PageHeader
				title="Site content"
				subtitle="Edit the words on each page and the order the sections appear in. One save updates the whole site."
				action={
					<AdminButton variant="primary" onClick={save} disabled={status === "saving"}>
						{status === "saving" ? "Saving…" : "Save changes"}
					</AdminButton>
				}
			/>

			{status === "saved" && (
				<AdminNotice tone="ok" onDismiss={() => setStatus("idle")}>
					Your changes are saved and live on the site.
				</AdminNotice>
			)}
			{status === "error" && (
				<AdminNotice tone="danger">
					Your changes could not be saved.{" "}
					<AdminButton variant="danger" onClick={save}>
						Try again
					</AdminButton>
				</AdminNotice>
			)}

			<PickerStyled>
				<AdminField label="Page" htmlFor="content-page">
					<AdminSelect id="content-page" value={slug} onChange={(e) => setSlug(e.target.value)}>
						{slugs.map((s) => (
							<option key={s} value={s}>
								{PAGE_LABELS[s] ?? humanise(s)}
							</option>
						))}
					</AdminSelect>
				</AdminField>
			</PickerStyled>

			<AdminCard title="Page details">
				<AdminField label="Browser tab title" htmlFor="meta-title">
					<AdminInput
						id="meta-title"
						value={page.metaTitle}
						onChange={(e) =>
							mutate((d) => {
								const p = d.pages[slug];
								if (p) p.metaTitle = e.target.value;
							})
						}
					/>
				</AdminField>
				<AdminField
					label="Search description"
					htmlFor="meta-description"
					hint="Shown under the page title in search results."
				>
					<AdminTextarea
						id="meta-description"
						rows={3}
						value={page.metaDescription}
						onChange={(e) =>
							mutate((d) => {
								const p = d.pages[slug];
								if (p) p.metaDescription = e.target.value;
							})
						}
					/>
				</AdminField>
			</AdminCard>

			{sections.map(renderSection)}
		</EditorStyled>
	);
}
