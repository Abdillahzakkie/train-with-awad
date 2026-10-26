import { api } from "@/constants";
import type { TLeadInput } from "@/server/validators/lead";

// Submit a booking enquiry. Returns the POST promise; the caller maps success
// and failure to the UI state.
export function useSubmitLead() {
	return (input: TLeadInput) => api().post("/api/leads", input);
}
