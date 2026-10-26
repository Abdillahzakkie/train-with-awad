import { notifyCoach, sendEmail } from "@/server/services/email";
import { describe, expect, it, vi } from "vitest";

// The test env uses a placeholder Resend key, so emailEnabled is false: a send
// logs what it would deliver and returns ok, never reaching the network.
describe("email service with email disabled", () => {
	it("skips the real send and returns ok", async () => {
		const info = vi.spyOn(console, "info").mockImplementation(() => {});
		const result = await sendEmail({ to: "a@example.com", subject: "Hi", html: "<p>Hi</p>" });
		expect(result).toEqual({ ok: true });
		expect(info).toHaveBeenCalled();
		info.mockRestore();
	});

	it("notifies the coach without throwing", async () => {
		vi.spyOn(console, "info").mockImplementation(() => {});
		const result = await notifyCoach({ name: "Sam", email: "sam@example.com", mode: "online" });
		expect(result).toEqual({ ok: true });
	});
});
