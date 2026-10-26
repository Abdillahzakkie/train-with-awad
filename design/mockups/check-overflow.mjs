/**
 * Fails when a frame's content does not fit the device it is drawn on.
 *
 * `.phone` and `.desk` are `overflow:hidden`, and so is any card inside them
 * that sets it, so a frame that grew past its screen loses its primary action
 * and nothing says so. Both axes are measured: a wider type scale pushes a
 * step or a price column off the right edge as readily as it pushes a button
 * off the bottom.
 *
 * Usage: node design/mockups/check-overflow.mjs [sheet.html ...]
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

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1900, height: 1200 } });
let bad = 0;
let checked = 0;

for (const sheet of sheets) {
	await page.goto("file://" + resolve(here, sheet), { waitUntil: "load" });
	// Scrollers inside a frame are legitimate; the device shell is not.
	const rows = await page.$$eval("figure.frame", (frames) =>
		frames.map((f) => {
			const sid = f.querySelector("figcaption .sid")?.textContent?.trim() ?? "?";
			const dev = f.querySelector(".phone, .desk");
			if (!dev) return { sid, skip: true };
			const over = [];
			const name = (e) => e.className.split(" ").filter(Boolean).slice(0, 2).join(".") || e.tagName.toLowerCase();

			// Vertical and horizontal are not the same kind of fault.
			//
			// A content region that holds more than fits is scrolling, which is a
			// real affordance, so only the device shell and the layout containers
			// are checked for height — those losing content means the screen lost
			// its primary action.
			//
			// Nothing legitimately clips sideways. A step or a price column cut off
			// mid-word is a defect wherever it happens, so width is checked on every
			// box that hides it.
			const tall = [dev, ...dev.querySelectorAll(".pbody, .pcontent, .pane")];
			for (const b of tall) {
				const st = getComputedStyle(b);
				if (b !== dev && (st.overflowY === "auto" || st.overflowY === "scroll")) continue;
				if (b.scrollHeight > b.clientHeight + 1) {
					over.push(`${name(b)} +${b.scrollHeight - b.clientHeight}px tall`);
				}
			}
			for (const b of [dev, ...dev.querySelectorAll("*")]) {
				const st = getComputedStyle(b);
				const hides = b === dev || st.overflowX === "hidden" || st.overflowX === "clip";
				if (hides && b.scrollWidth > b.clientWidth + 1) {
					over.push(`${name(b)} +${b.scrollWidth - b.clientWidth}px wide`);
				}
			}

			// A region that hides overflow is scrolling. A region that hides a BUTTON
			// has taken the action away, and the frame still passes every other
			// check because the shell itself did not grow.
			const devBottom = dev.getBoundingClientRect().bottom;
			for (const btn of dev.querySelectorAll(".btn")) {
				const r = btn.getBoundingClientRect();
				if (r.height === 0) continue;
				let limit = devBottom;
				for (let a = btn.parentElement; a && a !== dev.parentElement; a = a.parentElement) {
					const st = getComputedStyle(a);
					if (st.overflowY === "hidden" || st.overflowY === "clip") {
						limit = Math.min(limit, a.getBoundingClientRect().bottom);
					}
				}
				if (r.bottom > limit + 1) {
					over.push(
						`"${(btn.textContent || "").trim().slice(0, 24)}" cut off by ${Math.round(r.bottom - limit)}px`,
					);
				}
			}
			return { sid, over: over.slice(0, 4) };
		}),
	);

	for (const r of rows) {
		if (r.skip) continue;
		checked++;
		if (r.over.length) {
			bad++;
			console.log(`CLIPPED  ${sheet}  ${r.sid}  ${r.over.join(", ")}`);
		}
	}
}

await browser.close();
console.log(`${checked - bad}/${checked} frames fit. ${bad} clipped.`);
process.exit(bad ? 1 : 0);
