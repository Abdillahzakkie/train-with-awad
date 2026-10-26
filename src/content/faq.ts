// Frequently asked questions, in the order a prospective client asks them.

export interface IFaq {
	question: string;
	answer: string;
}

export const FAQS: IFaq[] = [
	{
		question: "How does online coaching work?",
		answer:
			"You book a free call, and Awad talks through your goals, your schedule, and your experience. He then writes a plan in a training app you check off each session. You record the big lifts, Awad reviews them within a day, and the plan updates every week based on how training went. You can message him between check-ins when something changes — an injury, a missed week, a competition date.",
	},
	{
		question: "Do I need a gym?",
		answer:
			"No. If you train at home, the plan works with whatever kit you have, and the Train Anywhere ebook covers bodyweight and minimal-equipment sessions.",
	},
	{
		question: "Where are the in-person sessions?",
		answer:
			"At a private gym in Northampton, with parking on site. Mornings, evenings, and weekends are available.",
	},
	{
		question: "How much does it cost?",
		answer:
			"Online coaching starts at £120 a month. In-person sessions start at £45. There's no tie-in on online coaching.",
	},
	{
		question: "I'm a beginner. Is that a problem?",
		answer:
			"No. Most lifters start unsure of the basics. The first block builds movement and confidence before load.",
	},
	{
		question: "Can I cancel?",
		answer:
			"Yes. Online coaching is billed monthly with no tie-in, so you can stop at the end of any month.",
	},
];
