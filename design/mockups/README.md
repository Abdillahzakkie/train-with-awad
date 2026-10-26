# The contact sheets — draw the screen before you build it

Every screen Train With Awad ships, drawn as a device frame with a stable id
(`<span class="sid">mkt-hero</span>`). Two sheets, one per surface:

| Sheet | Surface | Pages | Device |
|---|---|---|---|
| `01-marketing.html` | Marketing | Home, about, online coaching, in-person coaching, testimonials, FAQ, contact, legal | Phone 390 × 844 and desk 1280 × 800 |
| `02-shop.html` | Shop | Ebook catalogue, ebook detail, checkout hand-off, order states | Phone 390 × 844 and desk 1280 × 800 |

Both surfaces are one responsive web client. **Every frame is drawn at both
widths — the phone and the desk — because the built site serves both from one
page.** A frame that exists at one width only is half a screen. Draw the phone
frame and the desk frame of the same screen side by side so the responsive
behaviour is a decision, not an accident.

Draw a frame at its device's real CSS size. `--zoom` in `system.css` shrinks the
frame **and its contents together** through `transform: scale()` — content
inside is authored 1:1. An outline scaled without its contents clips the
screen's primary action, and nothing tells you it happened.

## The rule: the mockup comes first

**A new screen is drawn here before it is built, and a reworked screen is
redrawn here before it is reworked.** Not after, and not "when there's time".

The reason is practical. The frame is the artefact a reviewer checks the built
page against before the page exists. Build first and you get a screen that looks
reasonable and does not match what anyone agreed to, and nobody finds out until
it ships.

So the order is:

1. **Draw the frame** in the sheet for its surface, at both widths. Give it a
   `sid`, a name, and a one-line purpose.
2. **Run `build-manifest.mjs`** — the frame joins `manifest.json` as
   `status: "omitted"` until a screen answers it.
3. **Build the page** against the frame.
4. **Flip the manifest row** to `implemented` by adding the sid to `BUILT` in
   `build-manifest.mjs`, with the route that implements it.

## One system, and where it lives

Every frame is drawn in `system.css`, which mirrors the `--tw-*` token set in
`src/styles/global.ts` — the contract the built app reads (ARCHITECTURE.md §7).
A frame's `--tw-accent` is the app's `--tw-accent`; its `.status` is the app's
`.status`; its spacing is the app's `--tw-gap`.

**Where the two disagree, `src/styles/global.ts` wins and `system.css` is the
bug.** Keeping the tokens in one place is what makes that claim checkable rather
than decorative.

`system.css` is the vocabulary. A frame that invents its own colour, its own
radius, or its own card is a frame that cannot be compared to the screen it
draws. Add to `system.css` deliberately, in the same commit as the frame that
needed it — never inline a one-off in a sheet. There is no literal colour in a
sheet: every value is `var(--tw-*)` or a class.

## The rules a frame is checked against

From `design/DIRECTION.md`, which is the authority:

- **One accent colour.** Everything else is text, surface, and line.
- **One primary action per screen — "Book a free call".** It is the one
  conversion goal (ARCHITECTURE.md §5). Everything else is a secondary button or
  a text link.
- **Money renders as money.** `£9.99`. Never a bare number, never minor units.
  Tabular figures so a price column aligns.
- **Status is a word plus a colour, never a colour alone.**
- **Every screen has a real empty state** that names the action that fills it,
  and a failure state with a reason a human wrote and a button that fixes it.
- **Descriptive link text**, never "click here". Every control clears 44px.
- **Draw the awkward data** the real screen will meet: a testimonial long enough
  to wrap, an ebook list with one item, a contact form mid-error, a checkout
  that failed with its reason.
- **Dark by default.** There is no light variant.

## The four scripts, and when to run them

Run these from the repository root, or from `design/mockups`, after changing any
sheet. Each takes an optional list of sheets and checks every sheet when given
none.

```
node design/mockups/build-manifest.mjs   # the manifest matches the sheets
node design/mockups/check-overflow.mjs   # nothing clips out of its device
node design/mockups/check-ease.mjs       # the checkable EASE.md rules hold
node design/mockups/render-sheets.mjs    # the .png companions match the .html
```

`check-overflow.mjs` exists because `.phone` and `.desk` are `overflow:hidden`.
A frame that grew past its screen loses its primary action and nothing says so.
It measures both axes and checks the scroll regions `.pbody` (phone) and
`.pcontent` (desk).

`check-ease.mjs` decides the EASE rules a machine can decide: internal
vocabulary reaching a visitor, a screen with more than one primary action, a
failure state with nothing to press, and an empty state with no way out. Taste
is not checkable and is not checked.

`render-sheets.mjs` writes the checked-in `.png` beside each `.html`. Run it in
the same pass that changes a sheet. It fails rather than skips when Playwright or
a browser is absent. It needs `@playwright/test` and the Chromium browser:

```
pnpm install
pnpm exec playwright install chromium
```

## Ease of use is a checked rule, not a preference

`design/EASE.md` holds the rules a frame is redrawn against: the readable type
floor, one primary action per screen, the consequence written into the button
label, no internal vocabulary reaching a visitor, a failure that carries its own
fix, an empty state that names its action, and descriptive link text. Read it
before redrawing anything. Where it disagrees with what is drawn, the frame is
wrong.
