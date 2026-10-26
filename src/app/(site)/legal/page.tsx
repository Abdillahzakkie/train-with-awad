import { Button, Hero, Section } from "@/components";
import { LEGAL_CONTENT } from "@/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Privacy & terms",
	description: "How Train With Awad collects, uses, and protects your details, and what you can ask for.",
	openGraph: {
		title: "Privacy & terms — Train With Awad",
		description: "What Train With Awad collects, why, how long it is kept, and the choices you have.",
	},
};

export default function LegalPage() {
	const { hero, sections } = LEGAL_CONTENT;
	return (
		<>
			<Hero eyebrow={hero.eyebrow} title={hero.title} lede={hero.lede}>
				<Button as="a" href="/contact" variant="primary" size="lg">
					Book a free call
				</Button>
			</Hero>
			{sections.map((section) => (
				<Section key={section.heading} title={section.heading}>
					<p>{section.body}</p>
				</Section>
			))}
		</>
	);
}
