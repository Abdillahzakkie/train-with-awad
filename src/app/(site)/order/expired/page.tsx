import { Button, Failure, Section } from "@/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Download link expired — Train With Awad",
	description: "This download link has expired. Ask for a fresh one and keep your ebook.",
	robots: { index: false },
};

// The expired-link state. The failure states its cause and carries its own fix:
// a route to the contact page to ask for a fresh link.
export default function OrderExpiredPage() {
	return (
		<Section>
			<Failure
				title="This download link has expired"
				description="Download links work for 24 hours after your order, and this one is past it. Your purchase is still yours — ask for a fresh link and we'll email a new one, free."
			>
				<Button as="a" href="/contact" variant="primary">
					Ask for a fresh link
				</Button>
			</Failure>
		</Section>
	);
}
