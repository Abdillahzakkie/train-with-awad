import { EBOOKS } from "@/content";
import { config } from "@/server/config";
import { ServiceError } from "@/server/errors";
import { createCheckoutSession } from "@/server/services/stripe";
import { checkoutSchema } from "@/server/validators/checkout";
import { NextResponse } from "next/server";

// POST to start Stripe Checkout for one ebook. Look the slug up in the content
// catalogue, create a hosted session, and return its URL for the client to
// redirect to. Stripe hosts the card form — the site never sees card data.
export async function POST(request: Request) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Send a valid request body." }, { status: 400 });
	}

	const parsed = checkoutSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: "Choose an ebook and try again." }, { status: 400 });
	}

	const ebook = EBOOKS.find((item) => item.slug === parsed.data.slug);
	if (!ebook) {
		return NextResponse.json({ error: "That ebook was not found." }, { status: 404 });
	}

	try {
		const session = await createCheckoutSession({
			ebook: { slug: ebook.slug, title: ebook.title, stripePriceId: ebook.stripePriceId },
			successUrl: `${config.NEXT_PUBLIC_SITE_URL}/order`,
			cancelUrl: `${config.NEXT_PUBLIC_SITE_URL}/ebooks/${ebook.slug}`,
		});
		return NextResponse.json({ url: session.url });
	} catch (error) {
		if (error instanceof ServiceError) {
			return NextResponse.json({ error: error.message }, { status: error.status });
		}
		console.error("POST /api/checkout failed", error);
		return NextResponse.json({ error: "Could not start checkout. Try again." }, { status: 500 });
	}
}
