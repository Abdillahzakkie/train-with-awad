// The three "ways to train" cards on the home page. priceLabel is display copy
// — money renders as money. ctaHref points at the page that sells each one.

export interface IPlan {
	name: string;
	priceLabel: string;
	blurb: string;
	features: string[];
	featured?: boolean;
	ctaHref: string;
}

export const PLANS: IPlan[] = [
	{
		name: "Online coaching",
		priceLabel: "£120/mo",
		blurb: "Your coach in your pocket, wherever you lift.",
		features: [
			"A fresh plan in your app each week",
			"Form feedback within a day",
			"A weekly check-in that moves you on",
		],
		featured: true,
		ctaHref: "/online-coaching",
	},
	{
		name: "In-person coaching",
		priceLabel: "£45/session",
		blurb: "One to one in Northampton, hands on the bar.",
		features: [
			"Technique fixed while you lift",
			"A plan for the days you train alone",
			"Mornings, evenings, and weekends",
		],
		ctaHref: "/in-person-coaching",
	},
	{
		name: "Train anywhere",
		priceLabel: "From £7.99",
		blurb: "A proven plan you follow on your own.",
		features: ["Lift at your own pace", "Works at home or in a gym", "Yours to keep for good"],
		ctaHref: "/ebooks",
	},
];
