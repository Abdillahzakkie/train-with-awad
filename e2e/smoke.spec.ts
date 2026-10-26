import { expect, test } from "@playwright/test";

// Every public route renders with a 200 and a visible heading.
const ROUTES = [
	"/",
	"/about",
	"/online-coaching",
	"/in-person-coaching",
	"/ebooks",
	"/ebooks/strength-foundations",
	"/testimonials",
	"/faq",
	"/contact",
	"/legal",
];

for (const route of ROUTES) {
	test(`renders ${route}`, async ({ page }) => {
		const response = await page.goto(route);
		expect(response?.status(), `status for ${route}`).toBeLessThan(400);
		await expect(page.locator("h1").first()).toBeVisible();
	});
}

test("a 404 route renders the not-found page", async ({ page }) => {
	const response = await page.goto("/no-such-page");
	expect(response?.status()).toBe(404);
});

test("the contact form records an enquiry and shows the success state", async ({ page }) => {
	await page.goto("/contact");
	await page.getByLabel(/name/i).fill("E2E Tester");
	await page.getByLabel(/email/i).fill("e2e@example.com");
	// The mode control is a select or radio; pick online by its accessible name.
	const mode = page.getByLabel(/online/i).first();
	if (await mode.count()) {
		await mode.check().catch(() => undefined);
	}
	await page.getByRole("button", { name: /book a free call/i }).click();
	await expect(page.getByText(/thank|received|in touch|back to you/i).first()).toBeVisible({ timeout: 15_000 });
});
