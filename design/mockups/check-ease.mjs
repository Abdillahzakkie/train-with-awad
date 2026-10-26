/**
 * Checks the EASE.md rules that can be decided mechanically.
 *
 * Taste is not checkable and is not checked here. What is checkable: one
 * primary action per frame, a failure with a fix to press, an empty state with
 * a way out, and internal vocabulary reaching a visitor.
 *
 * Usage: node design/mockups/check-ease.mjs [sheet.html ...]
 */
import { chromium } from "@playwright/test";
import { readdirSync } from "node:fs";
import { resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
// Accept either a bare sheet name or a path from anywhere, so the command
// works whichever directory it is run from.
const sheets =
	process.argv.length > 2
		? process.argv.slice(2).map((a) => basename(a))
		: readdirSync(here)
				.filter((f) => /^\d\d-.*\.html$/.test(f))
				.sort();

// Internal terms that must never appear in a visitor-facing frame. These are
// implementation words — a visitor reads about the product, not how it is
// built.
const BANNED = ["webhook", "minor units", "SSG", "Route Handler", "zod", "Mongoose", "idempotency"];

const browser = await chromium.launch();
const page = await browser.newPage();
let fails = 0;
let frames = 0;

for (const sheet of sheets) {
	await page.goto("file://" + resolve(here, sheet), { waitUntil: "load" });
	const rows = await page.$$eval(
		"figure.frame",
		(fs, banned) =>
			fs
				.map((f) => {
					const sid = f.querySelector("figcaption .sid")?.textContent?.trim() ?? "?";
					const dev = f.querySelector(".phone, .desk");
					if (!dev) return null;
					// The fnote is commentary about the frame, not part of the screen.
					const text = dev.innerText || "";
					const hits = banned.filter((w) => new RegExp(`\\b${w}\\b`, "i").test(text));
					const primaries = dev.querySelectorAll(".btn.pri").length;
					const phone = dev.classList.contains("phone");
					const failures = [...dev.querySelectorAll(".failure")].filter(
						(e) => !e.querySelector(".btn"),
					).length;
					const empties = [...dev.querySelectorAll(".empty")].filter((e) => !e.querySelector(".btn")).length;
					return { sid, hits, primaries, failures, empties, phone };
				})
				.filter(Boolean),
		BANNED,
	);

	for (const r of rows) {
		frames++;
		const problems = [];
		if (r.hits.length) problems.push(`internal vocabulary: ${r.hits.join(", ")}`);
		// A phone screen asks one question. A desk page may carry a header action
		// and one in the body; three is a page that needs splitting.
		const maxPri = r.phone ? 1 : 2;
		if (r.primaries > maxPri) problems.push(`${r.primaries} primary actions`);
		if (r.failures) problems.push(`${r.failures} failure state(s) with no fix button`);
		if (r.empties) problems.push(`${r.empties} empty state(s) with no action`);
		if (problems.length) {
			fails++;
			console.log(`EASE  ${sheet}  ${r.sid}\n      ${problems.join("\n      ")}`);
		}
	}
}

await browser.close();
console.log(`${frames - fails}/${frames} frames pass the checkable EASE rules. ${fails} to fix.`);
process.exit(fails ? 1 : 0);
