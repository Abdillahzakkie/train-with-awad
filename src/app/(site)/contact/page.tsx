import { Hero, Section } from "@/components";
import ContactWrapper from "@/libs/ContactWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Book a free call — Train With Awad",
	description: "Book a free 20-minute call with Awad to talk through your goals. No obligation.",
};

// A thin server shell: the hero copy, then the client form wrapper that holds
// the state and submits the enquiry.
export default function ContactPage() {
	return (
		<>
			<Hero
				eyebrow="Contact"
				title="Book a free call"
				lede="Twenty minutes, no obligation. Tell Awad your goal and he replies himself."
			/>
			<Section>
				<ContactWrapper />
			</Section>
		</>
	);
}
