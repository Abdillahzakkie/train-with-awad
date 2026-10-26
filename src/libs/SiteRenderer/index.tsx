import {
	Button,
	Card,
	Ebook,
	Faq,
	FaqItem,
	Grid,
	Hero,
	Plan,
	Plans,
	Price,
	Quote,
	Section,
	Stat,
	Step,
	Steps,
} from "@/components";
import ContactWrapper from "@/libs/ContactWrapper";
import type { PublicEbook, PublicFaq, PublicPlan, PublicTestimonial } from "@/server/data";
import type { ISitePage, ISiteSection } from "@/types";
import { Fragment, type ReactNode } from "react";

// Renders a page from the editable content model: sections in `order`, with
// `visible:false` skipped, each `type` mapped to the existing component and its
// text pulled from `fields`. List-backed sections (plans, ebook teaser, quotes,
// FAQ) take their rows from the collections passed in; the contact form renders
// the client wrapper. The page stays identical to the static version when the
// content equals the defaults.

interface ISiteCollections {
	plans: PublicPlan[];
	testimonials: PublicTestimonial[];
	faqs: PublicFaq[];
	ebooks: PublicEbook[];
}

interface IProps extends Partial<ISiteCollections> {
	page: ISitePage;
}

// Fixed per-page layout the content model does not carry: the hero's media
// plate and centring, and the column count for feature-card grids. Holding it
// here keeps today's look without storing presentation as editable content.
const LAYOUT: Record<string, { heroMedia?: boolean; heroCenter?: boolean; featureCols?: 2 | 3 | 4 }> = {
	home: { heroMedia: true },
	about: { heroMedia: true, featureCols: 2 },
	"online-coaching": { heroMedia: true },
	"in-person-coaching": { heroMedia: true },
	testimonials: { heroCenter: true },
	faq: { heroCenter: true },
};

interface ICopyItem {
	title: string;
	body: string;
}

function str(fields: Record<string, unknown>, key: string): string {
	const value = fields[key];
	return typeof value === "string" ? value : "";
}

function list<T>(fields: Record<string, unknown>, key: string): T[] {
	const value = fields[key];
	return Array.isArray(value) ? (value as T[]) : [];
}

function initials(name: string): string {
	return name
		.split(" ")
		.map((word) => word[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

// Action-led plan link text, derived until a ctaLabel field lands in plans.
function planCta(name: string, href: string): string {
	return href === "/ebooks" ? "Browse the ebooks" : `See ${name.toLowerCase()}`;
}

function renderSection(section: ISiteSection, page: ISitePage, collections: ISiteCollections): ReactNode {
	const f = section.fields;
	const layout = LAYOUT[page.slug] ?? {};

	switch (section.type) {
		case "hero": {
			const label = str(f, "ctaLabel");
			// Marketing heroes carry a default booking call to action; the contact
			// hero shows none.
			const cta = label
				? { label, href: str(f, "ctaHref") || "/contact" }
				: page.slug === "contact"
					? null
					: { label: "Book a free call", href: "/contact" };
			return (
				<Hero
					eyebrow={str(f, "eyebrow")}
					title={str(f, "title")}
					lede={str(f, "lede")}
					center={layout.heroCenter}
					media={layout.heroMedia}
				>
					{cta && (
						<Button as="a" href={cta.href} variant="primary" size="lg">
							{cta.label}
						</Button>
					)}
				</Hero>
			);
		}

		case "plans":
			return (
				<Section eyebrow={str(f, "eyebrow")} title={str(f, "title")} sub={str(f, "sub")}>
					<Plans>
						{collections.plans.map((plan) => (
							<Plan
								key={plan.id}
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
			);

		case "steps":
			return (
				<Section eyebrow={str(f, "eyebrow")} title={str(f, "title")}>
					<Steps columns={3}>
						{list<ICopyItem>(f, "steps").map((step, i) => (
							<Step key={step.title} num={i + 1} title={step.title}>
								{step.body}
							</Step>
						))}
					</Steps>
				</Section>
			);

		case "features": {
			const items = list<ICopyItem>(f, "items");
			const points = items.length ? items : list<ICopyItem>(f, "points");
			return (
				<Section eyebrow={str(f, "eyebrow")} title={str(f, "title")}>
					<Grid $cols={layout.featureCols ?? 3}>
						{points.map((item) => (
							<Card key={item.title} icon title={item.title}>
								<p>{item.body}</p>
							</Card>
						))}
					</Grid>
				</Section>
			);
		}

		case "stats":
			return (
				<Section>
					<Grid $cols={3}>
						{list<{ value: string; label: string }>(f, "items").map((stat) => (
							<Stat key={stat.label} value={stat.value} label={stat.label} />
						))}
					</Grid>
				</Section>
			);

		case "priceCard":
			return (
				<Section>
					<Card icon title={str(f, "title")}>
						<Price>{str(f, "priceLabel")}</Price>
						<p>{str(f, "body")}</p>
						<Button as="a" href="/contact" variant="outline">
							{str(f, "ctaLabel")}
						</Button>
					</Card>
				</Section>
			);

		case "ebookTeaser":
			return (
				<Section eyebrow={str(f, "eyebrow")} title={str(f, "title")} sub={str(f, "sub")}>
					<Grid $cols={3}>
						{collections.ebooks.map((ebook) => (
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
			);

		case "leadQuote": {
			// A single, full-width lead testimonial — the first published one, the
			// same source as the old static home block.
			const lead = collections.testimonials[0];
			if (!lead) return null;
			return (
				<Section>
					<Quote
						stars={lead.rating ?? undefined}
						name={lead.name}
						meta={lead.detail}
						avatar={initials(lead.name)}
					>
						{lead.quote}
					</Quote>
				</Section>
			);
		}

		case "quotes":
			return (
				<Section>
					<Grid $cols={2}>
						{collections.testimonials.map((item) => (
							<Quote
								key={item.id}
								stars={item.rating ?? undefined}
								name={item.name}
								meta={item.detail}
								avatar={initials(item.name)}
							>
								{item.quote}
							</Quote>
						))}
					</Grid>
				</Section>
			);

		case "faqList":
			return (
				<Section>
					<Faq>
						{collections.faqs.map((item, i) => (
							<FaqItem key={item.question} question={item.question} defaultOpen={i === 0}>
								{item.answer}
							</FaqItem>
						))}
					</Faq>
				</Section>
			);

		case "legalBody":
			return (
				<>
					{list<{ heading: string; body: string }>(f, "sections").map((entry) => (
						<Section key={entry.heading} title={entry.heading}>
							<p>{entry.body}</p>
						</Section>
					))}
				</>
			);

		case "contactForm":
			return (
				<Section>
					<ContactWrapper />
				</Section>
			);

		default:
			// An unknown section type renders nothing rather than breaking the page.
			return null;
	}
}

export default function SiteRenderer({ page, plans = [], testimonials = [], faqs = [], ebooks = [] }: IProps) {
	const collections: ISiteCollections = { plans, testimonials, faqs, ebooks };
	const sections = [...page.sections].filter((section) => section.visible).sort((a, b) => a.order - b.order);
	return (
		<>
			{sections.map((section) => (
				<Fragment key={section.id}>{renderSection(section, page, collections)}</Fragment>
			))}
		</>
	);
}
