// Shared types, re-exported from one barrel so the client and server import
// from `@/types` rather than reaching into the server validators directly.

export type { TLeadInput } from "@/server/validators/lead";
export type { TCheckoutInput } from "@/server/validators/checkout";
export type { TLeadDoc } from "@/server/models/Lead";
export type { TOrderDoc } from "@/server/models/Order";

// Which coaching an enquiry is about.
export type TCoachingMode = "online" | "in-person";

// An ebook catalogue slug. The catalogue itself lives in `src/content`; the
// server treats a slug as opaque and validates it against that module.
export type TEbookSlug = string;

// The fields `stripe.createCheckoutSession` needs from a content ebook. A route
// passes the matching entry from `content/ebooks`.
export interface ICheckoutEbook {
	slug: TEbookSlug;
	title: string;
	stripePriceId: string;
}

// A transactional email the server sends through the email service.
export interface IEmailMessage {
	to: string;
	subject: string;
	html: string;
}

// The editable-content contract. A page is an ordered list of sections; a
// section is a typed block whose `fields` hold the editable text. Reordering
// sections or flipping `visible` changes what renders and where, so an admin can
// edit both the text and its position without a code change. `fields` is
// free-form because each `type` (hero, steps, priceCard, ...) owns its own
// shape; the renderer and editor read it by type.
export interface ISiteSection {
	id: string;
	type: string;
	order: number;
	visible: boolean;
	fields: Record<string, unknown>;
}

export interface ISitePage {
	slug: string;
	metaTitle: string;
	metaDescription: string;
	sections: ISiteSection[];
}

export interface SiteContentData {
	pages: Record<string, ISitePage>;
}
