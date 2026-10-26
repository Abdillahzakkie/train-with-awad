import "server-only";
import ImageKit from "imagekit";
import { type IStorageObject, type IStorageProvider, kindOf } from "./types";

const URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT || "";

// Lazily constructed so importing this module (the provider index imports both
// providers) never instantiates the client unless ImageKit is the active one.
let client: ImageKit | null = null;
function ik(): ImageKit {
	if (!client) {
		client = new ImageKit({
			publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
			privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
			urlEndpoint: URL_ENDPOINT,
		});
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
	const res = await ik().upload({
		file: Buffer.from(body),
		fileName,
		folder,
		useUniqueFileName: false,
		overwriteFile: true,
	});
	const outKey = noSlash(res.filePath);
	return { key: outKey, publicUrl: publicUrl(outKey) };
}

async function list(prefix = "uploads/"): Promise<IStorageObject[]> {
	const files = await ik().listFiles({ path: prefix.replace(/\/$/, ""), limit: 1000 });
	return files
		.filter((f) => "filePath" in f && f.type === "file")
		.map((f) => {
			const key = noSlash((f as { filePath: string }).filePath);
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
 * immediately but can take a few seconds to appear in listFiles — so a delete
 * right after a create (`retry`) polls until the index catches up, while the
 * common case (an older file, or a true miss) resolves on the first try.
 */
async function fileIdFor(key: string, retry = false): Promise<string | null> {
	const name = key.slice(key.lastIndexOf("/") + 1);
	const delays = retry ? [0, 1500, 2000, 2500] : [0];
	for (const d of delays) {
		if (d) await new Promise((r) => setTimeout(r, d));
		const files = await ik().listFiles({ searchQuery: `name="${name}"`, limit: 100 });
		const match = files.find((f) => "filePath" in f && noSlash(f.filePath) === key);
		if (match && "fileId" in match) return match.fileId;
	}
	return null;
}

async function remove(key: string): Promise<void> {
	if (!key) return;
	const id = await fileIdFor(key, true);
	if (id) await ik().deleteFile(id);
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
