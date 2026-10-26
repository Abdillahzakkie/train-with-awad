import { Button, Section, Success } from "@/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Order complete — Train With Awad",
	description: "Your ebook order is confirmed. Check your email for the download link.",
	robots: { index: false },
};

// The post-payment confirmation. Delivery is by email, so there is no order
// lookup here — the page reassures and points back to the catalogue.
export default function OrderPage() {
	return (
		<Section>
			<Success
				title="Payment received"
				description="Check your email for your download link. It works for 24 hours, and you can ask for a fresh link any time it runs out."
			>
				<Button as="a" href="/ebooks" variant="outline">
					Back to the ebooks
				</Button>
			</Success>
		</Section>
	);
}
