/* Derives manifest.json from the contact sheets themselves.
 *
 * The count is re-derived on every run, never typed. A manifest whose header
 * says 24 while the sheets hold 20 is worse than no manifest, because it is
 * believed — and a hand-maintained count goes stale the first time somebody
 * adds a frame in a hurry.
 *
 *   node design/mockups/build-manifest.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

// Two responsive web surfaces, each drawn on both the phone and the desk.
const SURFACES = {
	"01-marketing.html": { surface: "marketing", platform: "web", device: "responsive" },
	"02-shop.html": { surface: "shop", platform: "web", device: "responsive" },
};

// BUILT maps a frame to the route that serves it. A row listed here reads
// "implemented"; every other row reads "omitted".
//
// Nothing is built yet, so this is empty and every row reads "omitted". Add a
// sid here only after the screen has been driven against a running server, not
// after the markup was written — only a person can say a screen answers the
// frame it was drawn from.
const BUILT = {};

const FRAME =
	/<figcaption>\s*<span class="sid">([^<]+)<\/span>\s*<span class="snm">([^<]*)<\/span>\s*<span class="spu">([^<]*)<\/span>/g;

const decode = (s) =>
	s
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&nbsp;/g, " ")
		.trim();

const rows = [];
const perSheet = {};
const seen = new Map();

for (const file of readdirSync(here)
	.filter((f) => f in SURFACES)
	.sort()) {
	const meta = SURFACES[file];
	const html = readFileSync(join(here, file), "utf8");
	let m,
		n = 0;

	while ((m = FRAME.exec(html)) !== null) {
		const sid = decode(m[1]);
		if (seen.has(sid)) {
			console.error(`DUPLICATE sid "${sid}" in ${file} — already in ${seen.get(sid)}`);
			process.exitCode = 1;
		}
		seen.set(sid, file);

		rows.push({
			sid,
			name: decode(m[2]),
			purpose: decode(m[3]),
			sheet: file,
			surface: meta.surface,
			platform: meta.platform,
			device: meta.device,
			status: BUILT[sid] ? "implemented" : "omitted",
			reason: BUILT[sid] ? null : "No screen answers this frame yet.",
			route: BUILT[sid] || null,
		});
		n++;
	}
	perSheet[file] = n;
	if (n === 0) {
		console.error(`NO FRAMES found in ${file} — the regex or the sheet is wrong`);
		process.exitCode = 1;
	}
}

const manifest = {
	note: [
		"One entry per sid drawn in the contact sheets. The count is DERIVED by",
		"design/mockups/build-manifest.mjs, never typed — a manifest that disagrees",
		"with the sheets is worse than no manifest, because it is believed.",
		"",
		'A row reads "implemented" with its route when a screen answers the frame,',
		'and "omitted" otherwise. Every frame is one web screen drawn at two widths,',
		'phone and desk, so platform is "web" and device is "responsive".',
		"",
		"Re-run after changing any sheet: node design/mockups/build-manifest.mjs",
	].join("\n"),
	generated: new Date().toISOString().slice(0, 10),
	total: rows.length,
	perSheet,
	byStatus: rows.reduce((a, r) => ({ ...a, [r.status]: (a[r.status] || 0) + 1 }), {}),
	frames: rows,
};

writeFileSync(join(here, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

if (rows.length === 0) {
	console.log("NO FRAMES found — no sheet matched SURFACES, or the sheets hold no frames yet.");
} else {
	console.log(`manifest.json — ${rows.length} frames`);
	for (const [f, n] of Object.entries(perSheet)) console.log(`  ${f.padEnd(20)} ${n}`);
}
