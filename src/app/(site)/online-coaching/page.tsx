import { Button, Card, Grid, Hero, Price, Section, Step, Steps } from "@/components";
import { ONLINE_CONTENT } from "@/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Online coaching",
	description:
		"Online strength coaching from £120 a month: a plan built for you, form reviewed within a day, and a weekly check-in. Book a free call.",
	openGraph: {
		title: "Online coaching — Train With Awad",
		description: "A coached plan that travels with you — programming, weekly form review, and check-ins.",
	},
};

export default function OnlineCoachingPage() {
	const { hero, included, week, price } = ONLINE_CONTENT;

	return (
		<>
			<Hero eyebrow={hero.eyebrow} title={hero.title} lede={hero.lede} media>
				<Button as="a" href="/contact" variant="primary" size="lg">
					Book a free call
				</Button>
			</Hero>

			<Section eyebrow={included.eyebrow} title={included.title}>
				<Grid $cols={3}>
					{included.items.map((item) => (
						<Card key={item.title} icon title={item.title}>
							<p>{item.body}</p>
						</Card>
					))}
				</Grid>
			</Section>

			<Section eyebrow={week.eyebrow} title={week.title}>
				<Steps columns={3}>
					{week.steps.map((step, i) => (
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
