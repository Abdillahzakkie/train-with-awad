import { leadSchema } from "@/server/validators/lead";
import { describe, expect, it } from "vitest";

describe("leadSchema", () => {
	const valid = { name: "Sam Lifter", email: "sam@example.com", mode: "online" as const };

	it("accepts a minimal valid enquiry", () => {
		const result = leadSchema.safeParse(valid);
		expect(result.success).toBe(true);
	});

	it("trims whitespace around the name and email", () => {
		const result = leadSchema.safeParse({ ...valid, name: "  Sam  ", email: "  sam@example.com  " });
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.name).toBe("Sam");
			expect(result.data.email).toBe("sam@example.com");
		}
	});

	it("rejects a missing email", () => {
		const result = leadSchema.safeParse({ name: "Sam", mode: "online" });
		expect(result.success).toBe(false);
	});

	it("rejects an invalid email", () => {
		const result = leadSchema.safeParse({ ...valid, email: "not-an-email" });
		expect(result.success).toBe(false);
	});

	it("rejects a mode outside the allowed set", () => {
		const result = leadSchema.safeParse({ ...valid, mode: "hybrid" });
		expect(result.success).toBe(false);
	});

	it("accepts the optional phone and goal", () => {
		const result = leadSchema.safeParse({ ...valid, phone: "07123 456789", goal: "Squat 140kg" });
		expect(result.success).toBe(true);
	});
});
