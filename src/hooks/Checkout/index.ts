import { api } from "@/constants";

// Start hosted checkout for one ebook, then send the browser to the returned
// Stripe session URL. The site never renders a card form (ARCHITECTURE.md §9).
export function useStartCheckout() {
	return async (slug: string): Promise<void> => {
		const { data } = await api().post<{ url: string }>("/api/checkout", { slug });
		window.location.assign(data.url);
	};
}
