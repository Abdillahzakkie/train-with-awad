import { Button, Ebook, Grid, Hero, Plan, Plans, Price, Quote, Section, Step, Steps } from "@/components";
import { EBOOKS, HOME_CONTENT, PLANS, TESTIMONIALS } from "@/content";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
	title: { absolute: "Train With Awad — strength coaching online and in Northampton" },
	description:
		"Get stronger on a plan that fits your life. Online and in-person strength coaching in Northampton, plus training and nutrition ebooks.",
	openGraph: {
		title: "Train With Awad — strength coaching online and in Northampton",
		description: "Online and in-person strength coaching in Northampton, built around your life.",
	},
};

// Organization JSON-LD for search (ARCHITECTURE.md §5).
const ORG_LD = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: "Train With Awad",
	description: "Online and in-person strength coaching in Northampton.",
	url: SITE_URL,
	areaServed: "Northampton",
};

function initials(name: string) {
	return name
		.split(" ")
		.map((word) => word[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

// Descriptive, action-led link text derived from the plan until a ctaLabel
// field lands in src/content/plans.ts.
function planCta(name: string, href: string) {
	return href === "/ebooks" ? "Browse the ebooks" : `See ${name.toLowerCase()}`;
}

export default function HomePage() {
	const { hero, waysToTrain, howItWorks, ebooksTeaser } = HOME_CONTENT;
	const lead = TESTIMONIALS[0];

	return (
		<>
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is serialized from a trusted constant. */}
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_LD) }} />

			<Hero eyebrow={hero.eyebrow} title={hero.title} lede={hero.lede} media>
				<Button as="a" href="/contact" variant="primary" size="lg">
					Book a free call
				</Button>
			</Hero>

			<Section eyebrow={waysToTrain.eyebrow} title={waysToTrain.title} sub={waysToTrain.sub}>
				<Plans>
					{PLANS.map((plan) => (
						<Plan
							key={plan.name}
							name={plan.name}
							price={plan.priceLabel}
							desc={plan.blurb}
							features={plan.features}
							featured={plan.featured}
							tag={plan.featured ? "Most popular" : undefined}
						>
							<Button as="a" href={plan.ctaHref} variant="outline" block>
								{planCta(plan.name, plan.ctaHref)}
							</Button>
						</Plan>
					))}
				</Plans>
			</Section>

			<Section eyebrow={howItWorks.eyebrow} title={howItWorks.title}>
				<Steps columns={3}>
					{howItWorks.steps.map((step, i) => (
						<Step key={step.title} num={i + 1} title={step.title}>
							{step.body}
						</Step>
					))}
				</Steps>
			</Section>

			<Section>
				<Quote stars={lead.rating} name={lead.name} meta={lead.detail} avatar={initials(lead.name)}>
					{lead.quote}
				</Quote>
			</Section>

			<Section eyebrow={ebooksTeaser.eyebrow} title={ebooksTeaser.title} sub={ebooksTeaser.sub}>
				<Grid $cols={3}>
					{EBOOKS.map((ebook) => (
						<Ebook key={ebook.slug} title={ebook.title} blurb={ebook.blurb}>
							<Price>£{ebook.priceGBP.toFixed(2)}</Price>
							<Button as="a" href={`/ebooks/${ebook.slug}`} variant="outline">
								View {ebook.title}
							</Button>
						</Ebook>
					))}
				</Grid>
				<Button as="a" href="/ebooks" variant="ghost">
					Browse all ebooks
				</Button>
			</Section>
		</>
	);
}
