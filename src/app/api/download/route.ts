import { NextResponse } from "next/server";
import { EBOOKS } from "@/content";
import { config } from "@/server/config";
import { ServiceError } from "@/server/errors";
import { verifyDownloadToken } from "@/server/services/downloadToken";

// GET the ebook file behind a signed, time-limited token. A valid token
// redirects to the file; an expired one sends the buyer to the page that offers
// a fresh link.
//
// shortcut: redirects to a static path under /ebooks; swap for a signed
// object-storage URL when the files move off the app's public directory.
export async function GET(request: Request) {
	const token = new URL(request.url).searchParams.get("token");
	if (!token) {
		return new NextResponse("Missing download token.", { status: 400 });
	}

	try {
		const claim = verifyDownloadToken(token);
		const ebook = EBOOKS.find((item) => item.slug === claim.ebookSlug);
		if (!ebook) {
			return new NextResponse("That ebook was not found.", { status: 404 });
		}
		return NextResponse.redirect(`${config.NEXT_PUBLIC_SITE_URL}/ebooks/${ebook.slug}.pdf`);
	} catch (error) {
		if (error instanceof ServiceError && error.code === "expired_token") {
			return NextResponse.redirect(`${config.NEXT_PUBLIC_SITE_URL}/order/expired`);
		}
		if (error instanceof ServiceError) {
			return new NextResponse(error.message, { status: error.status });
		}
		console.error("GET /api/download failed", error);
		return new NextResponse("Download failed.", { status: 500 });
	}
}
