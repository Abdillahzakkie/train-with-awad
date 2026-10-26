import { connectToDatabase } from "@/server/db/connect";
import { Order } from "@/server/models/Order";
import { clean } from "../_crud";
import { errorResponse, guard } from "../_guard";

export async function GET() {
	try {
		await guard("orders", "read");
		await connectToDatabase();
		const docs = await Order.find().sort({ createdAt: -1 }).lean();
		return Response.json({ items: docs.map((d) => clean(d)) });
	} catch (e) {
		return errorResponse(e);
	}
}
