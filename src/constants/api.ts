import axios, { type AxiosInstance } from "axios";

// One axios instance for the whole client. A relative baseURL keeps calls on
// the same origin; withCredentials sends same-site cookies. There is no second
// fetch helper (ARCHITECTURE.md §6).
let instance: AxiosInstance | null = null;

export function api(): AxiosInstance {
	if (!instance) {
		instance = axios.create({ baseURL: "/", withCredentials: true });
	}
	return instance;
}
