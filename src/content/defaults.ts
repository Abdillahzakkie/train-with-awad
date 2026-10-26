// The seed-and-fallback for editable site content. DEFAULT_SITE_CONTENT captures
// every marketing page as an ordered list of typed sections whose `fields` hold
// the copy verbatim from the typed content modules in this folder. An empty
// database renders exactly this copy; the seeder writes it once and the admin
// editor takes over from there.
//
// Section `type` values used here:
//   hero, plans, steps, features, stats, ebookTeaser, priceCard, legalBody,
//   quotes, leadQuote, faqList, contactForm
// A section renders its `fields` by type; reordering sections or flipping
// `visible` changes what shows and where, with no code change.

import type { ISitePage, SiteContentData } from "@/types";
import { ABOUT_CONTENT, HOME_CONTENT, IN_PERSON_CONTENT, LEGAL_CONTENT, ONLINE_CONTENT } from "./pages";

function section(id: string, type: string, order: number, fields: Record<string, unknown>) {
	return { id, type, order, visible: true, fields };
}

const home: ISitePage = {
	slug: "home",
	metaTitle: "Train With Awad — strength coaching online and in Northampton",
	metaDescription:
		"Get stronger on a plan that fits your life. Online and in-person strength coaching in Northampton, plus training and nutrition ebooks.",
	sections: [
		section("hero", "hero", 0, { ...HOME_CONTENT.hero }),
		section("ways-to-train", "plans", 1, { ...HOME_CONTENT.waysToTrain }),
		section("how-it-works", "steps", 2, { ...HOME_CONTENT.howItWorks }),
		// Empty fields: the renderer features the first published testimonial, so
		// editing that testimonial updates the home lead-quote. Reorder or hide it
		// here like any other section.
		section("lead-quote", "leadQuote", 3, {}),
		section("ebooks-teaser", "ebookTeaser", 4, { ...HOME_CONTENT.ebooksTeaser }),
	],
};

const about: ISitePage = {
	slug: "about",
	metaTitle: "About",
	metaDescription:
		"Meet Awad, a Northampton strength coach with nine years taking lifters from first session to first competition, online and in person.",
	sections: [
		section("hero", "hero", 0, { ...ABOUT_CONTENT.hero }),
		section("stats", "stats", 1, { items: ABOUT_CONTENT.stats }),
		section("how-he-works", "features", 2, { ...ABOUT_CONTENT.howHeWorks }),
	],
};

const onlineCoaching: ISitePage = {
	slug: "online-coaching",
	metaTitle: "Online coaching",
	metaDescription:
		"Online strength coaching from £120 a month: a plan built for you, form reviewed within a day, and a weekly check-in. Book a free call.",
	sections: [
		section("hero", "hero", 0, { ...ONLINE_CONTENT.hero }),
		section("included", "features", 1, { ...ONLINE_CONTENT.included }),
		section("week", "steps", 2, { ...ONLINE_CONTENT.week }),
		section("price", "priceCard", 3, { ...ONLINE_CONTENT.price }),
	],
};

const inPersonCoaching: ISitePage = {
	slug: "in-person-coaching",
	metaTitle: "In-person coaching",
	metaDescription:
		"One-to-one strength coaching at a private Northampton gym from £45 a session, with a plan for the days you train alone.",
	sections: [
		section("hero", "hero", 0, { ...IN_PERSON_CONTENT.hero }),
		section("sessions", "features", 1, { ...IN_PERSON_CONTENT.sessions }),
		section("first-session", "steps", 2, { ...IN_PERSON_CONTENT.firstSession }),
		section("price", "priceCard", 3, { ...IN_PERSON_CONTENT.price }),
	],
};

const legal: ISitePage = {
	slug: "legal",
	metaTitle: "Privacy & terms",
	metaDescription: "How Train With Awad collects, uses, and protects your details, and what you can ask for.",
	sections: [
		section("hero", "hero", 0, { ...LEGAL_CONTENT.hero }),
		section("body", "legalBody", 1, { updated: LEGAL_CONTENT.updated, sections: LEGAL_CONTENT.sections }),
	],
};

// Testimonials, FAQ, and contact have no copy module today — the hero strings
// below are lifted verbatim from each page component, and the lists themselves
// render from the Testimonial and Faq collections (or their content seeds).
const testimonials: ISitePage = {
	slug: "testimonials",
	metaTitle: "Testimonials",
	metaDescription: "What training with Awad is like, in lifters' own words — the strong weeks and the honest ones.",
	sections: [
		section("hero", "hero", 0, {
			eyebrow: "Testimonials",
			title: "Real lifters, real numbers",
			lede: "The strong weeks and the hard ones, in their own words.",
			ctaLabel: "Book a free call",
			ctaHref: "/contact",
		}),
		section("quotes", "quotes", 1, {}),
	],
};

const faq: ISitePage = {
	slug: "faq",
	metaTitle: "FAQ",
	metaDescription:
		"Answers to common questions about online and in-person strength coaching with Awad — how it works, cost, and cancelling — before you book a free call.",
	sections: [
		section("hero", "hero", 0, {
			eyebrow: "FAQ",
			title: "Answers before you book",
			lede: "If yours isn't here, ask it on the call.",
			ctaLabel: "Book a free call",
			ctaHref: "/contact",
		}),
		section("list", "faqList", 1, {}),
	],
};

const contact: ISitePage = {
	slug: "contact",
	metaTitle: "Book a free call — Train With Awad",
	metaDescription: "Book a free 20-minute call with Awad to talk through your goals. No obligation.",
	sections: [
		section("hero", "hero", 0, {
			eyebrow: "Contact",
			title: "Book a free call",
			lede: "Twenty minutes, no obligation. Tell Awad your goal and he replies himself.",
		}),
		section("form", "contactForm", 1, {}),
	],
};

export const DEFAULT_SITE_CONTENT: SiteContentData = {
	pages: {
		home,
		about,
		"online-coaching": onlineCoaching,
		"in-person-coaching": inPersonCoaching,
		legal,
		testimonials,
		faq,
		contact,
	},
};
