import { Button, Card, Grid, Hero, Section, Stat } from "@/components";
import { ABOUT_CONTENT } from "@/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About",
	description:
		"Meet Awad, a Northampton strength coach with nine years taking lifters from first session to first competition, online and in person.",
	openGraph: {
		title: "About — Train With Awad",
		description: "Nine years coaching lifters in Northampton and online, from first session to first competition.",
	},
};

export default function AboutPage() {
	const { hero, stats, howHeWorks } = ABOUT_CONTENT;

	return (
		<>
			<Hero eyebrow={hero.eyebrow} title={hero.title} lede={hero.lede} media>
				<Button as="a" href="/contact" variant="primary" size="lg">
					Book a free call
				</Button>
			</Hero>

			<Section>
				<Grid $cols={3}>
					{stats.map((stat) => (
						<Stat key={stat.label} value={stat.value} label={stat.label} />
					))}
				</Grid>
			</Section>

			<Section eyebrow={howHeWorks.eyebrow} title={howHeWorks.title}>
				<Grid $cols={2}>
					{howHeWorks.points.map((point) => (
						<Card key={point.title} icon title={point.title}>
							<p>{point.body}</p>
						</Card>
					))}
				</Grid>
			</Section>
		</>
	);
}
