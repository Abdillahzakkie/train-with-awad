"use client";

import { Button, Hint } from "@/components";
import { useStartCheckout } from "@/hooks";
import { isAxiosError } from "axios";
import { useState } from "react";
import { BuyWrapStyled } from "./styled";

interface IBuyButtonProps {
	slug: string;
	// Display price for the label, already formatted as money (for example "£9.99").
	price: string;
}

type TStatus = "idle" | "starting" | "unavailable" | "error";

// Starts hosted checkout for one ebook. On success the browser navigates to
// Stripe, so the button stays disabled. A 503 means checkout is not configured
// yet; anything else is a transient error the buyer can retry.
export default function BuyButton({ slug, price }: IBuyButtonProps) {
	const startCheckout = useStartCheckout();
	const [status, setStatus] = useState<TStatus>("idle");

	async function onBuy() {
		setStatus("starting");
		try {
			await startCheckout(slug);
		} catch (error) {
			setStatus(isAxiosError(error) && error.response?.status === 503 ? "unavailable" : "error");
		}
	}

	return (
		<BuyWrapStyled>
			<Button
				type="button"
				variant="primary"
				size="lg"
				onClick={onBuy}
				disabled={status === "starting" || status === "unavailable"}
			>
				{status === "starting" ? "Taking you to secure checkout…" : `Buy for ${price}`}
			</Button>
			{status === "unavailable" && <Hint aria-live="polite">Checkout isn't available yet. Check back soon.</Hint>}
			{status === "error" && <Hint aria-live="polite">Could not start checkout. Try again.</Hint>}
		</BuyWrapStyled>
	);
}
