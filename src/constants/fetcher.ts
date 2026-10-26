import { api } from "@/constants/api";

// The SWR fetcher over the one axios instance. Reads go through this; mutations
// use the same instance directly.
export const fetcher = <T>(url: string): Promise<T> =>
	api()
		.get<T>(url)
		.then((res) => res.data);
