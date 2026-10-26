import { Hero, Hint, Price, Section } from "@/components";
import { EBOOKS } from "@/content";
import BuyButton from "@/libs/BuyButton";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface IPageProps {
	params: Promise<{ slug: string }>;
}

// Pre-render one page per ebook in the catalogue.
export function generateStaticParams() {
	return EBOOKS.map((ebook) => ({ slug: ebook.slug }));
}

export async function generateMetadata({ params }: IPageProps): Promise<Metadata> {
	const { slug } = await params;
	const ebook = EBOOKS.find((item) => item.slug === slug);
	if (!ebook) {
		return { title: "Ebook not found — Train With Awad" };
	}
	return {
		title: `${ebook.title} — Train With Awad`,
		description: ebook.blurb,
	};
}

const LAYOUT: React.CSSProperties = {
	display: "flex",
	flexWrap: "wrap",
	gap: "var(--tw-gap)",
	alignItems: "flex-start",
};
const DETAIL: React.CSSProperties = {
	flex: "1 1 320px",
	minWidth: 0,
	display: "flex",
	flexDirection: "column",
	gap: "var(--tw-gap)",
};
// A flat cover plate, drawn from tokens — never a real image placeholder with a
// literal colour.
const COVER: React.CSSProperties = {
	flex: "0 0 300px",
	aspectRatio: "3 / 4",
	background: "var(--tw-surface-2)",
	border: "1px solid var(--tw-line)",
	borderRadius: "var(--tw-radius)",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	color: "var(--tw-text-4)",
	fontSize: "var(--tw-fs-sm)",
	fontWeight: 600,
};

export default async function EbookPage({ params }: IPageProps) {
	const { slug } = await params;
	const ebook = EBOOKS.find((item) => item.slug === slug);
	if (!ebook) {
		notFound();
	}

	const price = `£${ebook.priceGBP.toFixed(2)}`;
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: ebook.title,
		description: ebook.blurb,
		offers: {
			"@type": "Offer",
			price: ebook.priceGBP.toFixed(2),
			priceCurrency: "GBP",
			availability: "https://schema.org/InStock",
		},
	};

	return (
		<>
			{/* The ebook title is the page's single h1, via Hero. */}
			<Hero eyebrow="Ebook" title={ebook.title} lede={ebook.blurb} />
			<Section>
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is serialized server-side from the trusted content module, never user input. */}
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
				<div style={LAYOUT}>
					<div style={COVER} aria-hidden="true">
						Cover
					</div>
					<div style={DETAIL}>
						<Price style={{ fontSize: "var(--tw-fs-xl)" }}>{price}</Price>
						<BuyButton slug={ebook.slug} price={price} />
						<Hint>
							You pay by card on a secure page, not on this site. The download link arrives by email and
							works for 24 hours.
						</Hint>
					</div>
				</div>
			</Section>
		</>
	);
}
