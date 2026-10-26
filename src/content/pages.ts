// Marketing copy for the static content pages, as typed objects. Wording is
// lifted from the approved mockups (design/mockups/01-marketing.html). A page
// renders these strings; it does not hold copy of its own.

export interface IHero {
	eyebrow: string;
	title: string;
	lede: string;
}

export interface IFeature {
	title: string;
	body: string;
}

export interface IStep {
	title: string;
	body: string;
}

export interface IStat {
	value: string;
	label: string;
}

export interface IPriceCard {
	title: string;
	priceLabel: string;
	body: string;
	ctaLabel: string;
}

export interface IHomeContent {
	hero: IHero;
	waysToTrain: { eyebrow: string; title: string; sub: string };
	howItWorks: { eyebrow: string; title: string; steps: IStep[] };
	ebooksTeaser: { eyebrow: string; title: string; sub: string };
}

export interface IAboutContent {
	hero: IHero;
	stats: IStat[];
	howHeWorks: { eyebrow: string; title: string; points: IFeature[] };
}

export interface IOnlineContent {
	hero: IHero;
	included: { eyebrow: string; title: string; items: IFeature[] };
	week: { eyebrow: string; title: string; steps: IStep[] };
	price: IPriceCard;
}

export interface IInPersonContent {
	hero: IHero;
	sessions: { eyebrow: string; title: string; items: IFeature[] };
	firstSession: { eyebrow: string; title: string; steps: IStep[] };
	price: IPriceCard;
}

export interface ILegalSection {
	heading: string;
	body: string;
}

export interface ILegalContent {
	hero: IHero;
	updated: string;
	sections: ILegalSection[];
}

export const HOME_CONTENT: IHomeContent = {
	hero: {
		eyebrow: "Get visibly stronger · Northampton & online",
		title: "Get stronger on a plan that fits your life",
		lede: "Train with a coach who writes your plan, reviews your form every week, and keeps you moving forward — in Northampton or wherever you lift.",
	},
	waysToTrain: {
		eyebrow: "Three ways to train",
		title: "Pick how you want to be coached",
		sub: "Coached online, coached in person in Northampton, or a plan you follow yourself.",
	},
	howItWorks: {
		eyebrow: "How it works",
		title: "From first call to first lift",
		steps: [
			{ title: "Book a free call", body: "Twenty minutes on your goals. No obligation." },
			{ title: "Get your plan", body: "Built around your schedule, your kit, your experience." },
			{ title: "Train and check in", body: "Lift, send your form, and get weekly adjustments." },
		],
	},
	ebooksTeaser: {
		eyebrow: "Ebooks",
		title: "Start lifting tonight",
		sub: "Three guides, yours to keep.",
	},
};

export const ABOUT_CONTENT: IAboutContent = {
	hero: {
		eyebrow: "About",
		title: "Nine years getting lifters stronger",
		lede: "Awad coaches in Northampton and online, taking lifters from their first nervous session to their first competition.",
	},
	stats: [
		{ value: "9 yrs", label: "Coaching strength" },
		{ value: "300+", label: "Lifters coached" },
		{ value: "Northampton", label: "In person & online" },
	],
	howHeWorks: {
		eyebrow: "How he works",
		title: "A plan you follow, form that keeps you lifting",
		points: [
			{
				title: "Plan first",
				body: "A plan written around your life, not a template with your name dropped on it.",
			},
			{
				title: "Form every week",
				body: "You send videos of the big lifts and Awad catches a fault before it becomes a habit.",
			},
			{
				title: "Honest check-ins",
				body: "A bad week changes the plan. Progress comes from adjusting, not from pretending.",
			},
			{
				title: "Qualified",
				body: "Level 3 personal trainer, powerlifting coach, first-aid certified, and fully insured.",
			},
		],
	},
};

export const ONLINE_CONTENT: IOnlineContent = {
	hero: {
		eyebrow: "Online coaching · from £120/mo",
		title: "Get coached wherever you lift",
		lede: "Awad writes your plan, reviews your form, and adjusts it every week — the full coaching relationship, without the commute.",
	},
	included: {
		eyebrow: "What's included",
		title: "Everything a coached lifter gets",
		items: [
			{ title: "Weekly programming", body: "Your sessions in an app, ready to tick off." },
			{ title: "Form review", body: "Feedback on the big lifts within a day." },
			{ title: "Weekly check-in", body: "A short review that sets next week." },
			{ title: "Message access", body: "Reach Awad when something changes." },
			{ title: "Built around you", body: "Your schedule, your kit, your experience." },
			{ title: "No tie-in", body: "Billed monthly. Stop whenever you need to." },
		],
	},
	week: {
		eyebrow: "A coached week",
		title: "How online coaching runs",
		steps: [
			{ title: "Train to the plan", body: "Open the app, do the session, log your lifts." },
			{ title: "Send your form", body: "Record the big lifts; Awad reviews them within a day." },
			{ title: "Check in", body: "A short review sets next week, and the plan updates." },
		],
	},
	price: {
		title: "Online coaching",
		priceLabel: "£120/mo",
		body: "Monthly, no tie-in. If you train at home, the plan works with the kit you have.",
		ctaLabel: "Book a free call to start",
	},
};

export const IN_PERSON_CONTENT: IInPersonContent = {
	hero: {
		eyebrow: "In-person · Northampton · from £45/session",
		title: "Fix your lifts with eyes on the bar",
		lede: "One to one at a private Northampton gym, plus a plan for the days you train alone. The fastest way to fix a lift is to have a coach watch it.",
	},
	sessions: {
		eyebrow: "The sessions",
		title: "What in-person coaching includes",
		items: [
			{ title: "Hands-on technique", body: "Awad watches every rep and corrects it on the spot." },
			{ title: "A plan for between", body: "Sessions you do alone, matched to what you cover together." },
			{ title: "Flexible times", body: "Mornings, evenings, and weekends at a private gym." },
		],
	},
	firstSession: {
		eyebrow: "What to expect",
		title: "Your first session",
		steps: [
			{ title: "Where", body: "A private gym in Northampton, parking on site." },
			{ title: "What happens", body: "A movement check and a light session — no obligation." },
			{ title: "What you need", body: "Just training kit. If you're new, bring questions." },
		],
	},
	price: {
		title: "In-person coaching",
		priceLabel: "£45/session",
		body: "Book single sessions or a block. If you're training for a competition, ask about a weekly slot.",
		ctaLabel: "Book a free call to start",
	},
};

export const LEGAL_CONTENT: ILegalContent = {
	hero: {
		eyebrow: "Legal",
		title: "Privacy & terms",
		lede: "What Train With Awad collects, why, and what you can ask for. Last updated 1 October 2026.",
	},
	updated: "1 October 2026",
	sections: [
		{
			heading: "What we collect",
			body: "When you book a call we store the name, email, and any phone number and goal you enter on the contact form. When you buy an ebook we store the email the order was placed with and a record of the purchase.",
		},
		{
			heading: "Why we collect it",
			body: "To reply to your enquiry and arrange the call, and to send the ebook you bought and support that order. Nothing else. We don't sell your details or send marketing you didn't ask for.",
		},
		{
			heading: "Payments",
			body: "Ebooks are sold through a secure payment provider that handles the card form on its own pages. Your card details never reach Train With Awad's servers.",
		},
		{
			heading: "How long we keep it",
			body: "Enquiry details are kept while we're in contact and removed on request. Order records are kept as long as the law requires for a sale, then removed.",
		},
		{
			heading: "Your choices",
			body: "You can ask to see the details we hold, correct them, or have them deleted at any time. Email the address on the contact page and we'll act within 30 days.",
		},
		{
			heading: "Contact",
			body: "Questions about privacy go to the same place as a booking — the contact page.",
		},
	],
};
