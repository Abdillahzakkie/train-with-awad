import "server-only";
import ImageKit, { toFile } from "@imagekit/nodejs";
import { type IStorageObject, type IStorageProvider, kindOf } from "./types";

const URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT || "";

// Lazily constructed so importing this module (the provider index imports both
// providers) never instantiates the client unless ImageKit is the active one.
// The @imagekit/nodejs v7 client authenticates with the private key; URLs are
// built from the endpoint below, so no urlEndpoint is passed here.
let client: ImageKit | null = null;
function ik(): ImageKit {
	if (!client) {
		client = new ImageKit({ privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "" });
	}
	return client;
}

const noSlash = (p: string) => p.replace(/^\/+/, "");

function publicUrl(key: string): string {
	return `${URL_ENDPOINT}/${noSlash(key)}`;
}

// ImageKit auto-creates folders on upload; nothing to provision.
async function ensureReady(): Promise<void> {}

async function upload(
	key: string,
	body: Uint8Array,
	_contentType: string,
): Promise<{ key: string; publicUrl: string }> {
	const slash = key.lastIndexOf("/");
	const folder = slash >= 0 ? key.slice(0, slash) : "/";
	const fileName = slash >= 0 ? key.slice(slash + 1) : key;
	const res = await ik().files.upload({
		file: await toFile(Buffer.from(body), fileName),
		fileName,
		folder,
		useUniqueFileName: false,
		overwriteFile: true,
	});
	const outKey = noSlash(res.filePath ?? `${folder}/${fileName}`);
	return { key: outKey, publicUrl: publicUrl(outKey) };
}

// assets.list returns files and folders; keep the files and shape them.
async function list(prefix = "uploads/"): Promise<IStorageObject[]> {
	const items = await ik().assets.list({ path: prefix.replace(/\/$/, ""), type: "file", limit: 1000 });
	return items
		.filter((f): f is typeof f & { filePath: string } => "filePath" in f && typeof f.filePath === "string")
		.map((f) => {
			const key = noSlash(f.filePath);
			return {
				key,
				url: publicUrl(key),
				size: (f as { size?: number }).size ?? 0,
				lastModified: (f as { updatedAt?: string }).updatedAt ?? new Date().toISOString(),
				kind: kindOf(key),
			};
		})
		.sort((a, b) => b.lastModified.localeCompare(a.lastModified));
}

/**
 * Resolves a key (filePath) to ImageKit's fileId, which deletes require.
 * ImageKit's file index is eventually consistent — a file is reachable by URL
 * immediately but can take a few seconds to appear in a listing — so a delete
 * right after a create (`retry`) polls until the index catches up, while the
 * common case (an older file, or a true miss) resolves on the first try.
 */
async function fileIdFor(key: string, retry = false): Promise<string | null> {
	const name = key.slice(key.lastIndexOf("/") + 1);
	const delays = retry ? [0, 1500, 2000, 2500] : [0];
	for (const d of delays) {
		if (d) await new Promise((r) => setTimeout(r, d));
		const items = await ik().assets.list({ searchQuery: `name="${name}"`, type: "file", limit: 100 });
		const match = items.find((f) => "filePath" in f && noSlash((f as { filePath: string }).filePath) === key);
		if (match && "fileId" in match && typeof match.fileId === "string") return match.fileId;
	}
	return null;
}

async function remove(key: string): Promise<void> {
	if (!key) return;
	const id = await fileIdFor(key, true);
	if (id) await ik().files.delete(id);
}

async function exists(key: string): Promise<boolean> {
	return (await fileIdFor(key)) !== null;
}

// No copy-with-rename in ImageKit, so re-upload the bytes under the new key; the
// caller deletes the source afterwards.
async function copy(srcKey: string, destKey: string): Promise<void> {
	const res = await fetch(publicUrl(srcKey));
	if (!res.ok) throw new Error(`Source not found: ${srcKey}`);
	const bytes = new Uint8Array(await res.arrayBuffer());
	await upload(destKey, bytes, res.headers.get("content-type") || "application/octet-stream");
}

async function getStream(key: string): Promise<{ body: ReadableStream; contentType: string } | null> {
	const res = await fetch(publicUrl(key));
	if (!res.ok || !res.body) return null;
	return {
		body: res.body,
		contentType: res.headers.get("content-type") || "application/octet-stream",
	};
}

export const imagekitProvider: IStorageProvider = {
	publicUrl,
	ensureReady,
	upload,
	list,
	remove,
	exists,
	copy,
	getStream,
};
