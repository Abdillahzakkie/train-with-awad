"use client";

import { type ChangeEvent, useRef, useState } from "react";
import useSWR from "swr";
import { api, fetcher } from "@/constants";
import { AdminButton, AdminEmpty, AdminGridStyled, AdminModal, AdminNotice, PageHeader } from "@/libs/adminUi";
import { MediaTileStyled } from "./styled";

// One stored object, as GET /api/admin/upload returns it.
interface IMediaItem {
	key: string;
	url: string;
	size: number;
	lastModified: string;
	kind: "image" | "video" | "file";
}

// The stored key is `uploads/<timestamp>-<name>`; show the original name.
function fileName(key: string): string {
	return key.replace(/^uploads\//, "").replace(/^\d+-/, "");
}

export default function AdminMediaWrapper() {
	const { data, isLoading, mutate } = useSWR<{ items: IMediaItem[] }>("/api/admin/upload", fetcher);
	const images = (data?.items ?? []).filter((item) => item.kind === "image");

	const fileRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState("");
	const [copied, setCopied] = useState<string | null>(null);
	const [removing, setRemoving] = useState<IMediaItem | null>(null);
	const [busy, setBusy] = useState(false);

	const pickFile = () => fileRef.current?.click();

	const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		e.target.value = ""; // Let the same file be chosen again after an error.
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			setError("Choose an image file, such as a PNG, JPG, WebP, or GIF.");
			return;
		}
		setError("");
		setUploading(true);
		try {
			const form = new FormData();
			form.append("file", file);
			await api().post("/api/admin/upload", form);
			await mutate();
		} catch {
			setError("That upload didn't work. Check the file and try again.");
		} finally {
			setUploading(false);
		}
	};

	const copyLink = async (item: IMediaItem) => {
		try {
			await navigator.clipboard.writeText(item.url);
			setCopied(item.key);
			setTimeout(() => setCopied((current) => (current === item.key ? null : current)), 2000);
		} catch {
			setError("Couldn't copy the link. Open the image and copy its address instead.");
		}
	};

	const confirmRemove = async () => {
		if (!removing) return;
		setBusy(true);
		try {
			await api().delete("/api/admin/upload", { data: { key: removing.key } });
			await mutate();
			setRemoving(null);
		} catch {
			setError("Couldn't delete that image. Try again.");
		} finally {
			setBusy(false);
		}
	};

	return (
		<>
			<PageHeader
				title="Media"
				subtitle="Images you can use across the site."
				action={
					<AdminButton variant="primary" onClick={pickFile} disabled={uploading}>
						{uploading ? "Uploading…" : "Upload an image"}
					</AdminButton>
				}
			/>

			<input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />

			{error && (
				<AdminNotice tone="danger" onDismiss={() => setError("")}>
					{error}
				</AdminNotice>
			)}

			{isLoading ? (
				<AdminNotice tone="info">Loading images…</AdminNotice>
			) : images.length === 0 ? (
				<AdminEmpty title="No images yet" description="Upload one to use it on the site.">
					<AdminButton variant="primary" onClick={pickFile} disabled={uploading}>
						{uploading ? "Uploading…" : "Upload an image"}
					</AdminButton>
				</AdminEmpty>
			) : (
				<AdminGridStyled $cols={3}>
					{images.map((item) => (
						<MediaTileStyled key={item.key}>
							{/* A stored thumbnail, not Next image — the admin serves arbitrary storage URLs. */}
							<img src={item.url} alt={fileName(item.key)} loading="lazy" />
							<span className="name" title={fileName(item.key)}>
								{fileName(item.key)}
							</span>
							<div className="actions">
								<AdminButton variant="secondary" onClick={() => copyLink(item)}>
									{copied === item.key ? "Copied" : "Copy link"}
								</AdminButton>
								<AdminButton variant="danger" onClick={() => setRemoving(item)}>
									Delete
								</AdminButton>
							</div>
						</MediaTileStyled>
					))}
				</AdminGridStyled>
			)}

			<AdminModal
				open={removing !== null}
				title="Delete this image?"
				confirmLabel="Delete"
				cancelLabel="Keep"
				danger
				busy={busy}
				onConfirm={confirmRemove}
				onCancel={() => setRemoving(null)}
			>
				{removing &&
					`“${fileName(removing.key)}” will be removed. Any page using it shows a broken image until you replace it.`}
			</AdminModal>
		</>
	);
}
