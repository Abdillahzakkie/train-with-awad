import { config } from "@/server/config";
import mongoose from "mongoose";

interface IMongooseCache {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
}

// Cache the connection on `globalThis` so Next's hot reload reuses one pool
// across rebuilds instead of opening a new connection on every change.
declare global {
	// `var` is required to augment the global scope for the hot-reload cache.
	var __twMongoose: IMongooseCache | undefined;
}

const cache: IMongooseCache = globalThis.__twMongoose ?? { conn: null, promise: null };
globalThis.__twMongoose = cache;

// Connect to the MongoDB named in MONGODB_URI (the shared Docker container on
// host port 27018). Never assume a host-installed Mongo.
export async function connectToDatabase(): Promise<typeof mongoose> {
	if (cache.conn) {
		return cache.conn;
	}
	if (!cache.promise) {
		cache.promise = mongoose.connect(config.MONGODB_URI, { bufferCommands: false });
	}
	try {
		cache.conn = await cache.promise;
	} catch (error) {
		// Clear the failed promise so the next request retries the connection.
		cache.promise = null;
		throw new Error(`connect to MongoDB failed: ${(error as Error).message}`, { cause: error });
	}
	return cache.conn;
}
