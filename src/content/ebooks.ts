// The ebook catalogue. Prices are display values; Stripe holds the charged
// price (ARCHITECTURE.md §9). Titles and prices are fixed.

export interface IEbook {
	slug: string;
	title: string;
	blurb: string;
	priceGBP: number;
	cover: string;
	stripePriceId: string;
}

export const EBOOKS: IEbook[] = [
	{
		slug: "strength-foundations",
		title: "Strength Foundations",
		blurb: "Add weight to the squat, hinge, press and pull over twelve weeks you can run in any gym.",
		priceGBP: 9.99,
		cover: "/ebooks/strength-foundations.png",
		stripePriceId: "price_placeholder_strength-foundations",
	},
	{
		slug: "eat-to-perform",
		title: "Eat to Perform",
		blurb: "Eat to train harder and recover faster, without weighing a single meal.",
		priceGBP: 7.99,
		cover: "/ebooks/eat-to-perform.png",
		stripePriceId: "price_placeholder_eat-to-perform",
	},
	{
		slug: "train-anywhere",
		title: "Train Anywhere",
		blurb: "Keep your strength when you travel or the gym shuts, with full sessions using dumbbells or none.",
		priceGBP: 8.99,
		cover: "/ebooks/train-anywhere.png",
		stripePriceId: "price_placeholder_train-anywhere",
	},
];
