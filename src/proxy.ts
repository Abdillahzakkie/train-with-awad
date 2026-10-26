import { type NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/server/jwt";

// Gate every /admin page behind a valid session. /signin stays public (it is not
// matched). Admin API mutations additionally check requirePermission() in-handler.
// Next 16 renamed the middleware convention to proxy (src/proxy.ts, export proxy).
export async function proxy(req: NextRequest) {
	const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
	if (!session) {
		const url = req.nextUrl.clone();
		url.pathname = "/signin";
		url.searchParams.set("next", req.nextUrl.pathname);
		return NextResponse.redirect(url);
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"],
};
