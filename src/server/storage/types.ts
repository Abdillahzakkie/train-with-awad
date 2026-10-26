import "server-only";

export type TMediaKind = "image" | "video" | "file";

export interface IStorageObject {
	key: string;
	url: string;
	size: number;
	lastModified: string;
	kind: TMediaKind;
}

// The storage contract the app depends on. Every media operation goes through
// these methods, so the rest of the codebase never knows which backend stores
// the bytes. `key` is always in `uploads/<name>` form (no leading slash).
export interface IStorageProvider {
	publicUrl(key: string): string;
	// Prepares the backing store (e.g. create the bucket). No-op where unneeded.
	ensureReady(): Promise<void>;
	upload(key: string, body: Uint8Array, contentType: string): Promise<{ key: string; publicUrl: string }>;
	list(prefix?: string): Promise<IStorageObject[]>;
	remove(key: string): Promise<void>;
	exists(key: string): Promise<boolean>;
	copy(srcKey: string, destKey: string): Promise<void>;
	getStream(key: string): Promise<{ body: ReadableStream; contentType: string } | null>;
}

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|avif|svg)$/i;
const VIDEO_EXT = /\.(mp4|mov|webm|m4v|ogv)$/i;

export function kindOf(key: string): TMediaKind {
	if (IMAGE_EXT.test(key)) return "image";
	if (VIDEO_EXT.test(key)) return "video";
	return "file";
}
