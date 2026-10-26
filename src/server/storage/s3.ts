import "server-only";
import {
	CopyObjectCommand,
	CreateBucketCommand,
	DeleteObjectCommand,
	GetObjectCommand,
	HeadBucketCommand,
	HeadObjectCommand,
	ListObjectsV2Command,
	PutBucketPolicyCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { type IStorageObject, type IStorageProvider, kindOf } from "./types";

const BUCKET = process.env.S3_BUCKET || "train-with-awad";
const ASSET_BASE = process.env.S3_PUBLIC_URL || `${process.env.S3_ENDPOINT || ""}/${BUCKET}`;

const s3 = new S3Client({
	endpoint: process.env.S3_ENDPOINT,
	region: process.env.S3_REGION || "us-east-1",
	// MinIO needs path-style addressing; default on unless explicitly disabled.
	forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== "false",
	// The SDK's default flexible checksum injects an x-amz-checksum-crc32 header
	// that MinIO rejects (400) on a plain upload; only add one when required.
	requestChecksumCalculation: "WHEN_REQUIRED",
	responseChecksumValidation: "WHEN_REQUIRED",
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
	},
});

function publicUrl(key: string): string {
	return `${ASSET_BASE}/${key}`;
}

// Creates the bucket and a public-read policy if it does not exist yet.
async function ensureReady(): Promise<void> {
	try {
		await s3.send(new HeadBucketCommand({ Bucket: BUCKET }));
		return;
	} catch {
		// not found — create it below
	}
	await s3.send(new CreateBucketCommand({ Bucket: BUCKET }));
	await s3.send(
		new PutBucketPolicyCommand({
			Bucket: BUCKET,
			Policy: JSON.stringify({
				Version: "2012-10-17",
				Statement: [
					{
						Effect: "Allow",
						Principal: { AWS: ["*"] },
						Action: ["s3:GetObject"],
						Resource: [`arn:aws:s3:::${BUCKET}/*`],
					},
				],
			}),
		}),
	);
}

async function upload(key: string, body: Uint8Array, contentType: string): Promise<{ key: string; publicUrl: string }> {
	await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: contentType }));
	return { key, publicUrl: publicUrl(key) };
}

async function list(prefix = "uploads/"): Promise<IStorageObject[]> {
	const out = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix }));
	return (out.Contents ?? [])
		.filter((o): o is typeof o & { Key: string } => Boolean(o.Key))
		.map((o) => ({
			key: o.Key,
			url: publicUrl(o.Key),
			size: o.Size ?? 0,
			lastModified: (o.LastModified ?? new Date()).toISOString(),
			kind: kindOf(o.Key),
		}))
		.sort((a, b) => b.lastModified.localeCompare(a.lastModified));
}

async function remove(key: string): Promise<void> {
	if (!key) return;
	await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

async function getStream(key: string): Promise<{ body: ReadableStream; contentType: string } | null> {
	try {
		const out = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
		if (!out.Body) return null;
		return {
			body: out.Body.transformToWebStream(),
			contentType: out.ContentType || "application/octet-stream",
		};
	} catch {
		return null;
	}
}

async function exists(key: string): Promise<boolean> {
	try {
		await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
		return true;
	} catch {
		return false;
	}
}

async function copy(srcKey: string, destKey: string): Promise<void> {
	await s3.send(new CopyObjectCommand({ Bucket: BUCKET, CopySource: `${BUCKET}/${srcKey}`, Key: destKey }));
}

export const s3Provider: IStorageProvider = {
	publicUrl,
	ensureReady,
	upload,
	list,
	remove,
	exists,
	copy,
	getStream,
};
