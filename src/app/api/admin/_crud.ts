import "server-only";
import type { Model } from "mongoose";
import { connectToDatabase } from "@/server/db/connect";
import type { TResource } from "@/server/iam";
import { errorResponse, guard } from "./_guard";

// Shared CRUD factory for the admin collections (ebooks/testimonials/faq/plans),
// which differ only by model, resource name and field validation. Keeps each
// route file a thin binding instead of repeating the guard/connect/clean dance.

type Params = { params: Promise<{ id: string }> };

// _id -> id, dropping Mongo/Mongoose internals, matching @/server/data clean().
// biome-ignore lint/suspicious/noExplicitAny: lean()/toObject() return loosely-typed docs.
export function clean<T extends Record<string, any>>(doc: T) {
	const { _id, __v, createdAt, updatedAt, ...rest } = doc;
	return { id: String(_id), ...rest };
}

/** A 400 the caller can act on, thrown so errorResponse returns it as-is. */
export function badRequest(message: string): Response {
	return Response.json({ error: message }, { status: 400 });
}

interface FieldSpec {
	type: "string" | "number" | "boolean" | "string[]" | "enum";
	required?: boolean;
	values?: readonly string[];
}

// Turns a validated value into the stored form, or throws a 400. Unknown input
// is never trusted: wrong types are rejected, numbers coerced from strings.
function coerce(key: string, value: unknown, spec: FieldSpec): unknown {
	switch (spec.type) {
		case "string":
			if (typeof value !== "string") throw badRequest(`${key} must be a string.`);
			return value;
		case "number": {
			const n = typeof value === "string" && value.trim() !== "" ? Number(value) : value;
			if (typeof n !== "number" || !Number.isFinite(n)) throw badRequest(`${key} must be a number.`);
			return n;
		}
		case "boolean":
			if (typeof value !== "boolean") throw badRequest(`${key} must be a boolean.`);
			return value;
		case "string[]":
			if (!Array.isArray(value) || !value.every((v) => typeof v === "string")) {
				throw badRequest(`${key} must be an array of strings.`);
			}
			return value;
		case "enum":
			if (typeof value !== "string" || !spec.values?.includes(value)) {
				throw badRequest(`${key} must be one of: ${spec.values?.join(", ")}.`);
			}
			return value;
	}
}

export type Prepare = (body: unknown, partial: boolean) => Record<string, unknown>;

// Builds a validator from a field spec. Rejects unknown keys and (on create)
// missing required fields with a 400; a partial update validates only what's
// present so a PATCH-style PUT need not resend every field.
function makePrepare(specs: Record<string, FieldSpec>): Prepare {
	return (body, partial) => {
		if (!body || typeof body !== "object" || Array.isArray(body)) throw badRequest("Body must be an object.");
		const obj = body as Record<string, unknown>;
		for (const key of Object.keys(obj)) {
			if (!(key in specs)) throw badRequest(`Unknown field: ${key}.`);
		}
		const out: Record<string, unknown> = {};
		for (const [key, spec] of Object.entries(specs)) {
			if (!(key in obj)) {
				if (spec.required && !partial) throw badRequest(`Missing required field: ${key}.`);
				continue;
			}
			out[key] = coerce(key, obj[key], spec);
		}
		return out;
	};
}

const STATUS: FieldSpec = { type: "enum", values: ["Published", "Draft"] };

export const prepareEbook = makePrepare({
	slug: { type: "string", required: true },
	title: { type: "string", required: true },
	blurb: { type: "string" },
	priceGBP: { type: "number", required: true },
	cover: { type: "string" },
	stripePriceId: { type: "string" },
	order: { type: "number" },
	status: STATUS,
});

export const prepareTestimonial = makePrepare({
	name: { type: "string", required: true },
	quote: { type: "string", required: true },
	detail: { type: "string" },
	rating: { type: "number" },
	order: { type: "number" },
	status: STATUS,
});

export const prepareFaq = makePrepare({
	question: { type: "string", required: true },
	answer: { type: "string", required: true },
	order: { type: "number" },
	status: STATUS,
});

export const preparePlan = makePrepare({
	name: { type: "string", required: true },
	priceLabel: { type: "string" },
	blurb: { type: "string" },
	features: { type: "string[]" },
	featured: { type: "boolean" },
	ctaHref: { type: "string" },
	order: { type: "number" },
	status: STATUS,
});

/** GET (list all, order:1) [read] + POST (create) [full] for a collection. */
export function collectionRoutes<T>(model: Model<T>, resource: TResource, prepare: Prepare) {
	return {
		async GET() {
			try {
				await guard(resource, "read");
				await connectToDatabase();
				const docs = await model.find().sort({ order: 1 }).lean();
				return Response.json({ items: docs.map((d) => clean(d)) });
			} catch (e) {
				return errorResponse(e);
			}
		},
		async POST(req: Request) {
			try {
				await guard(resource, "full");
				const data = prepare(await req.json().catch(() => null), false);
				await connectToDatabase();
				const doc = new model(data);
				await doc.save();
				return Response.json({ item: clean(doc.toObject()) }, { status: 201 });
			} catch (e) {
				return errorResponse(e);
			}
		},
	};
}

/** PUT (update) [full] + DELETE [full] for one item of a collection. */
export function itemRoutes<T>(model: Model<T>, resource: TResource, prepare: Prepare) {
	return {
		async PUT(req: Request, ctx: Params) {
			try {
				await guard(resource, "full");
				const data = prepare(await req.json().catch(() => null), true);
				await connectToDatabase();
				const { id } = await ctx.params;
				const doc = await model
					.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true })
					.lean();
				if (!doc) return Response.json({ error: "Not found." }, { status: 404 });
				return Response.json({ item: clean(doc) });
			} catch (e) {
				return errorResponse(e);
			}
		},
		async DELETE(_req: Request, ctx: Params) {
			try {
				await guard(resource, "full");
				await connectToDatabase();
				const { id } = await ctx.params;
				const doc = await model.findByIdAndDelete(id).lean();
				if (!doc) return Response.json({ error: "Not found." }, { status: 404 });
				return Response.json({ ok: true });
			} catch (e) {
				return errorResponse(e);
			}
		},
	};
}

/** POST {ids} [full] → set each doc's `order` to its index in `ids`. */
export function reorderRoute<T>(model: Model<T>, resource: TResource) {
	return {
		async POST(req: Request) {
			try {
				await guard(resource, "full");
				const ids = (await req.json().catch(() => null))?.ids;
				if (!Array.isArray(ids) || !ids.every((x) => typeof x === "string")) {
					return badRequest("ids must be an array of strings.");
				}
				await connectToDatabase();
				await Promise.all(
					ids.map((id: string, i: number) => model.updateOne({ _id: id }, { $set: { order: i } })),
				);
				return Response.json({ ok: true });
			} catch (e) {
				return errorResponse(e);
			}
		},
	};
}
