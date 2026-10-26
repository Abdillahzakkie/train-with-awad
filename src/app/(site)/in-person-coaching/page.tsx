import { Button, Card, Grid, Hero, Price, Section, Step, Steps } from "@/components";
import { IN_PERSON_CONTENT } from "@/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "In-person coaching",
	description:
		"One-to-one strength coaching at a private Northampton gym from £45 a session, with a plan for the days you train alone.",
	openGraph: {
		title: "In-person coaching — Train With Awad",
		description: "Hands-on technique coaching in Northampton, plus a plan for the days you train alone.",
	},
};

export default function InPersonCoachingPage() {
	const { hero, sessions, firstSession, price } = IN_PERSON_CONTENT;

	return (
		<>
			<Hero eyebrow={hero.eyebrow} title={hero.title} lede={hero.lede} media>
				<Button as="a" href="/contact" variant="primary" size="lg">
					Book a free call
				</Button>
			</Hero>

			<Section eyebrow={sessions.eyebrow} title={sessions.title}>
				<Grid $cols={3}>
					{sessions.items.map((item) => (
						<Card key={item.title} icon title={item.title}>
							<p>{item.body}</p>
						</Card>
					))}
				</Grid>
			</Section>

			<Section eyebrow={firstSession.eyebrow} title={firstSession.title}>
				<Steps columns={3}>
					{firstSession.steps.map((step, i) => (
						<Step key={step.title} num={i + 1} title={step.title}>
							{step.body}
						</Step>
					))}
				</Steps>
			</Section>

			<Section>
				<Card icon title={price.title}>
					<Price>{price.priceLabel}</Price>
					<p>{price.body}</p>
					<Button as="a" href="/contact" variant="outline">
						{price.ctaLabel}
					</Button>
				</Card>
			</Section>
		</>
	);
}
