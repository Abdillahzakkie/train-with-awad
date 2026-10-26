/**
 * Renders each contact sheet to a checked-in .png beside its .html.
 *
 * A PNG made once and never again drifts behind its sheet silently, and a
 * reader who opens the picture instead of the page reports finished work as
 * missing. So this runs in the same pass that changes a sheet.
 *
 * It fails rather than skips when Playwright or a browser is absent: a
 * renderer that quietly does nothing is how the drift starts.
 *
 * Usage: node design/mockups/render-sheets.mjs [sheet.html ...]
 */
import { readdirSync, statSync } from "node:fs";
import { resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

let chromium;
try {
	({ chromium } = await import("@playwright/test"));
} catch (cause) {
	console.error("render-sheets: @playwright/test is not installed. Run `pnpm install`.");
	process.exit(1);
}

const sheets =
	process.argv.length > 2
		? process.argv.slice(2).map((s) => basename(s))
		: readdirSync(here)
				.filter((f) => /^\d\d-.*\.html$/.test(f))
				.sort();

let browser;
try {
	browser = await chromium.launch();
} catch (cause) {
	console.error(`render-sheets: no browser to render with. ${cause.message}`);
	console.error("Run `pnpm exec playwright install chromium`.");
	process.exit(1);
}

// Wide enough that the phone sheets lay out several frames across, which is how
// a sheet is read. Height is whatever the content needs.
for (const sheet of sheets) {
	const html = resolve(here, sheet);
	// A fresh page per sheet. Reusing one across navigations produced a blank
	// 1KB image for the later sheets, and a blank render is worse than no
	// render: it looks like a finished picture of an empty page.
	//
	// Scale 1, not 2. These are checked in, and a retina contact sheet is four
	// times the bytes for a picture nobody zooms into — the .html is there for
	// anyone who needs the detail.
	const page = await browser.newPage({
		viewport: { width: 1760, height: 1200 },
		deviceScaleFactor: 1,
	});
	await page.goto("file://" + html, { waitUntil: "load" });
	const { width, height, frames } = await page.evaluate(() => ({
		width: document.documentElement.scrollWidth,
		height: document.documentElement.scrollHeight,
		frames: document.querySelectorAll("figure.frame").length,
	}));
	const out = html.replace(/\.html$/, ".png");
	await page.screenshot({ path: out, fullPage: true });
	await page.close();

	// A sheet of device frames never compresses to a few kilobytes. Anything
	// that small is a picture of nothing, so it fails here rather than being
	// committed and believed.
	const bytes = statSync(out).size;
	if (bytes < 50_000) {
		console.error(
			`render-sheets: ${basename(out)} came out at ${bytes} bytes — that is a blank render, not a sheet.`,
		);
		await browser.close();
		process.exit(1);
	}
	console.log(`${sheet} -> ${basename(out)}  ${width}x${height}  ${frames} frames  ${Math.round(bytes / 1024)}KB`);
}

await browser.close();
console.log(`${sheets.length} sheet(s) rendered.`);
