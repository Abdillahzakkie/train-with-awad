import mongoose from "mongoose";

// Drop the throwaway e2e database so a run leaves the shared Mongo as it found
// it. Scoped to the e2e database name only; it never touches the app database.
export default async function globalTeardown() {
	const uri = "mongodb://127.0.0.1:27018/train-with-awad-e2e";
	if (!uri.includes("-e2e")) {
		throw new Error(`refusing to drop a database that is not the e2e throwaway: ${uri}`);
	}
	await mongoose.connect(uri);
	await mongoose.connection.dropDatabase();
	await mongoose.disconnect();
}
