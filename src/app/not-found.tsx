import type { Metadata } from "next";
import { Button, Empty, Section } from "@/components";

export const metadata: Metadata = {
	title: "Page not found",
};

export default function NotFound() {
	return (
		<Section>
			<Empty
				title="This page isn't here"
				description="The link you followed leads nowhere now. The home page has every way to train and the way to book a call."
			>
				<Button as="a" href="/" variant="primary">
					Back to the home page
				</Button>
			</Empty>
		</Section>
	);
}
