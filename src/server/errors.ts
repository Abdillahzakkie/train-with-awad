// A service-layer error that carries the HTTP status and a stable code a thin
// route handler maps to a response. Internal detail stays in `cause` and the
// logs, never in `message`.
export class ServiceError extends Error {
	readonly status: number;
	readonly code: string;

	constructor(code: string, message: string, status: number, options?: ErrorOptions) {
		super(message, options);
		this.name = "ServiceError";
		this.code = code;
		this.status = status;
	}
}

// Stripe is not configured in this environment (placeholder key). A route maps
// this to 503 so the caller learns payments are unavailable, not that the
// request was malformed.
export class StripeDisabledError extends ServiceError {
	constructor() {
		super("stripe_disabled", "Stripe is not configured in this environment.", 503);
	}
}
