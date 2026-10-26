# Design direction

Read this before drawing anything. Every artboard follows it exactly.

## What the design has to solve

Train With Awad is the marketing and sales site for a strength coach who works
online and in person in Northampton. The site has three jobs (ARCHITECTURE.md
§1): explain the offer, capture leads, and sell ebooks. The design serves those
three and nothing else — it is a content site with one form and one checkout,
not an app.

The visitor is a prospective client reading on a phone or a laptop, deciding
whether to book a free call. The design earns that call. Every screen points at
it.

## Rules that are not negotiable

- **One accent colour.** A single warm amber (`--tw-accent`) for the one thing
  that matters on a screen. Everything else is text, surface, and line. A second
  accent is a second priority, and a screen with two priorities has none.
- **Dark ground, by default and only.** There is no light variant. The dark
  surface carries the athletic, direct tone the copy sets (ARCHITECTURE.md §7).
- **One primary action per screen: "Book a free call".** It is the one
  conversion goal (ARCHITECTURE.md §5). It is a single `.btn.pri`. Everything
  else is a secondary button (`.btn`) or a text link. The shop's "Buy" is the
  one place a different primary action is correct, on the ebook screens.
- **Money renders as money.** `£9.99`, with tabular figures so a price column
  aligns. Never a bare number, never minor units.
- **Status is a word plus a colour, never a colour alone.** Colour-blind
  visitors exist, and a coloured dot with no word is a guess.
- **Every screen has a real empty state** that names the action that fills it —
  an ebook catalogue with nothing in it still shows how to get notified, not "no
  data".
- **Every screen has a failure state with a reason a human wrote**, and a button
  that performs the recovery. "That payment did not go through. Your card was
  not charged." plus a **Try again** button beats a blank screen.
- **Minimum touch target 44px.** Every button, link, and field clears it on a
  phone.
- **Descriptive link text, never "click here".** A link says where it goes:
  "Read the online coaching plan", not "learn more". The site's job is to be
  found and read (ARCHITECTURE.md §13), and a screen reader reads link text out
  of context.
- **No internal vocabulary on a visitor-facing screen.** A visitor reads about
  the product, not how it is built. Words like webhook, Route Handler, or minor
  units never reach a frame's rendered text.

## Responsive is the product, not a pass

The site is one responsive web client. **Every screen is drawn at both widths —
the phone (390 × 844) and the desk (1280 × 800).** A screen drawn at one width
only is half a decision. The phone frame and the desk frame of the same screen
are drawn together, so how the layout reflows — a three-column plan row becoming
a stack, a top nav becoming a menu — is chosen, not left to chance. No
horizontal scroll at any width.

## One system, one token set

A single `--tw-*` token set, mirrored from `src/styles/global.ts`
(ARCHITECTURE.md §7). The two surfaces, marketing and shop, differ by content,
never by vocabulary. The recurring layout units are components: `Section`,
`Card`, `Stat`, `Step`, `Quote`, the three "ways to train" plan cards, and the
ebook card. A frame composes these; it does not invent a new one.

## Ease of use is a checked rule

`design/EASE.md` holds the rules that decide whether a first-time visitor can
use a screen. It refines this file rather than competing with it: this file says
what a screen is for, EASE.md says how little a person has to know to work it.

Two of those rules are decided by machine rather than by review:

```
node design/mockups/check-overflow.mjs   # nothing clips out of its device
node design/mockups/check-ease.mjs       # one primary action, live states, no jargon
```

Run both before calling a frame done.

## Artboard before component

`design/mockups/` holds a contact sheet per surface, one frame per screen at
both widths, each with a stable id. Add the frame, run `build-manifest.mjs`,
then build the component. A frame and its component are one description of one
screen — when either changes, both change in the same commit.

Draw the awkward data the real screen will meet: a testimonial long enough to
wrap, an ebook catalogue with one item, a contact form mid-error, a checkout
that failed with its reason, an FAQ answer that runs long.

The rule, the sheet list, and what a frame is checked against live in
`design/mockups/README.md`.
