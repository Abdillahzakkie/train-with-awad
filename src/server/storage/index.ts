import "server-only";
import { s3Provider } from "./s3";
import type { IStorageProvider } from "./types";

// One active provider. s3 covers S3 and MinIO; add an alternative here behind
// STORAGE_PROVIDER if one is ever needed. The rest of the app imports the names
// below and never knows which backend stores the bytes.
const provider: IStorageProvider = s3Provider;

export const publicUrl = (key: string) => provider.publicUrl(key);
export const ensureStorageReady = () => provider.ensureReady();
export const uploadObject = (key: string, body: Uint8Array, contentType: string) =>
	provider.upload(key, body, contentType);
export const listObjects = (prefix?: string) => provider.list(prefix);
export const deleteObject = (key: string) => provider.remove(key);
export const objectExists = (key: string) => provider.exists(key);
export const copyObject = (srcKey: string, destKey: string) => provider.copy(srcKey, destKey);
export const getObjectStream = (key: string) => provider.getStream(key);

export type { TMediaKind, IStorageObject } from "./types";
