import { connectToDatabase } from "@/server/db/connect";
import { Ebook } from "@/server/models/Ebook";
import { Faq } from "@/server/models/Faq";
import { Lead } from "@/server/models/Lead";
import { Order } from "@/server/models/Order";
import { Plan } from "@/server/models/Plan";
import { Testimonial } from "@/server/models/Testimonial";
import { errorResponse, guard } from "../_guard";

// Dashboard tallies for any signed-in admin. Guarded on content:read as the
// least resource; the counts expose no record contents.
export async function GET() {
	try {
		await guard("content", "read");
		await connectToDatabase();
		const [ebooks, testimonials, faq, plans, leads, orders] = await Promise.all([
			Ebook.countDocuments(),
			Testimonial.countDocuments(),
			Faq.countDocuments(),
			Plan.countDocuments(),
			Lead.countDocuments(),
			Order.countDocuments(),
		]);
		return Response.json({ counts: { ebooks, testimonials, faq, plans, leads, orders } });
	} catch (e) {
		return errorResponse(e);
	}
}
