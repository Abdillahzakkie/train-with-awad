import { Button, Faq, FaqItem, Hero, Section } from "@/components";
import { FAQS } from "@/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "FAQ",
	description:
		"Answers to common questions about online and in-person strength coaching with Awad — how it works, cost, and cancelling — before you book a free call.",
	openGraph: {
		title: "FAQ — Train With Awad",
		description: "How coaching with Awad works, what it costs, and how to cancel, before you book a free call.",
	},
};

export default function FaqPage() {
	return (
		<>
			<Hero center eyebrow="FAQ" title="Answers before you book" lede="If yours isn't here, ask it on the call.">
				<Button as="a" href="/contact" variant="primary" size="lg">
					Book a free call
				</Button>
			</Hero>
			<Section>
				<Faq>
					{FAQS.map((item, i) => (
						<FaqItem key={item.question} question={item.question} defaultOpen={i === 0}>
							{item.answer}
						</FaqItem>
					))}
				</Faq>
			</Section>
		</>
	);
}
