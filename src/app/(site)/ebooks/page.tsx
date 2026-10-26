import type { Metadata } from "next";
import Link from "next/link";
import { Ebook, Hero, Price, Section } from "@/components";
import { getEbooks } from "@/server/data";

// Rendered per request so the catalogue and prices stay live with the database.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Ebooks — Train With Awad",
	description:
		"Buy a strength-training guide once and keep the file. Three ebooks from a Northampton strength coach, delivered by email.",
};

// A responsive auto-fit grid: three across on a laptop, one on a phone, with no
// media query. Each card is a link whose accessible name is the ebook it opens.
const GRID: React.CSSProperties = {
	display: "grid",
	gap: "var(--tw-gap)",
	gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
};

const CARD_LINK: React.CSSProperties = { textDecoration: "none", color: "inherit", display: "block" };

export default async function EbooksPage() {
	const ebooks = await getEbooks({ publishedOnly: true });
	return (
		<>
			<Hero
				eyebrow="Ebooks"
				title="Get stronger on your own schedule"
				lede="Pick a guide, pay by card, and get the file by email. Buy it once and it is yours to keep."
			/>
			<Section>
				<div style={GRID}>
					{ebooks.map((ebook) => (
						<Link key={ebook.slug} href={`/ebooks/${ebook.slug}`} style={CARD_LINK}>
							<Ebook title={ebook.title} blurb={ebook.blurb} cover="Cover">
								<Price>£{ebook.priceGBP.toFixed(2)}</Price>
								<span>View the ebook</span>
							</Ebook>
						</Link>
					))}
				</div>
			</Section>
		</>
	);
}
