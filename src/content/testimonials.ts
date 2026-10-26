// Client testimonials, in their own words. The mix is deliberate: one long
// story and one honest four-star account, drawn from the approved mockup copy.

export interface ITestimonial {
	name: string;
	quote: string;
	detail?: string;
	rating?: number;
}

export const TESTIMONIALS: ITestimonial[] = [
	{
		name: "James P.",
		quote: "I came to Awad after two years of training on my own and going nowhere. He rebuilt my squat from the ground up, gave me a plan I could follow around shift work, and checked my form every single week. Fourteen months in I've added 40kg to my total and I turn up to every session knowing exactly what to do. The accountability was the part I didn't know I needed.",
		detail: "Online coaching · 14 months",
		rating: 5,
	},
	{
		name: "Priya S.",
		quote: "I'll be straight: the first month was harder than I expected and I missed two check-ins. Awad didn't let me drift — he scaled the plan back, and once the volume settled I started making progress I could see. I rated the first block 3 out of 5 and the next one 5. Wish I'd trusted it sooner.",
		detail: "In-person · Northampton · 7 months",
		rating: 4,
	},
	{
		name: "Dan M.",
		quote: "Clear plans, quick replies, no nonsense. Strongest I've been at 41.",
		detail: "Online · 8 months",
		rating: 5,
	},
	{
		name: "Sarah K.",
		quote: "One in-person session fixed the deadlift setup I'd had wrong for twelve years. Worth it on day one.",
		detail: "In-person · Northampton",
		rating: 5,
	},
];
