import { Button, Grid, Hero, Quote, Section } from "@/components";
import { TESTIMONIALS } from "@/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Testimonials",
	description: "What training with Awad is like, in lifters' own words — the strong weeks and the honest ones.",
	openGraph: {
		title: "Testimonials — Train With Awad",
		description: "Lifters on coaching with Awad, online and in Northampton.",
	},
};

function initials(name: string) {
	return name
		.split(" ")
		.map((word) => word[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

export default function TestimonialsPage() {
	return (
		<>
			<Hero
				center
				eyebrow="Testimonials"
				title="Real lifters, real numbers"
				lede="The strong weeks and the hard ones, in their own words."
			>
				<Button as="a" href="/contact" variant="primary" size="lg">
					Book a free call
				</Button>
			</Hero>

			<Section>
				<Grid $cols={2}>
					{TESTIMONIALS.map((item) => (
						<Quote
							key={item.name}
							stars={item.rating}
							name={item.name}
							meta={item.detail}
							avatar={initials(item.name)}
						>
							{item.quote}
						</Quote>
					))}
				</Grid>
			</Section>
		</>
	);
}
