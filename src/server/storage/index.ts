import "server-only";
import { imagekitProvider } from "./imagekit";
import { s3Provider } from "./s3";
import type { IStorageProvider } from "./types";

/** The active provider, chosen by STORAGE_PROVIDER (default: s3/MinIO). */
export function activeProvider(): "s3" | "imagekit" {
	return process.env.STORAGE_PROVIDER === "imagekit" ? "imagekit" : "s3";
}

// s3 covers S3 and MinIO; imagekit is the alternative. The rest of the app
// imports the names below and never knows which backend stores the bytes.
const provider: IStorageProvider = activeProvider() === "imagekit" ? imagekitProvider : s3Provider;

export const publicUrl = (key: string) => provider.publicUrl(key);
export const ensureStorageReady = () => provider.ensureReady();
export const uploadObject = (key: string, body: Uint8Array, contentType: string) =>
	provider.upload(key, body, contentType);
export const listObjects = (prefix?: string) => provider.list(prefix);
export const deleteObject = (key: string) => provider.remove(key);
export const objectExists = (key: string) => provider.exists(key);
export const copyObject = (srcKey: string, destKey: string) => provider.copy(srcKey, destKey);
export const getObjectStream = (key: string) => provider.getStream(key);

export type { IStorageObject, TMediaKind } from "./types";
