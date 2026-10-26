# Train With Awad — architecture, design, and code style

This document defines how Train With Awad is built. It follows the conventions
already in use across the owner's projects: the marketing-plus-admin shape of
`portfolio`, the frontend conventions of `nitrate` (the newest style), and the
Go and Docker rules that apply to every project. Read it before you plan a
screen or write a line of code.

The audience is a developer building or extending the site. Where this document
and a sample in a feature plan disagree, keep the plan's exported interfaces and
follow the conventions here.

---

## 1. What the site is

Train With Awad is the marketing and sales site for a strength coach who works
online and in person in Northampton. It has three jobs:

1. **Explain the offer** across content pages: home, about, online coaching,
   in-person coaching, FAQ, testimonials, and legal.
2. **Capture leads.** Every path ends at "Book a free call", a form that records
   an enquiry and notifies the coach.
3. **Sell ebooks.** A small catalogue (Strength Foundations £9.99, Eat to Perform
   £7.99, Train Anywhere £8.99) sold through hosted checkout, with the file
   delivered after payment.

The site is content-heavy and low-traffic. Most pages change rarely. The only
parts that are genuinely dynamic are lead capture and ebook orders. The
architecture is sized to that reality: static-first pages, one write path for
leads, and a payment provider for orders. It is not sized to a content platform
the coach never asked for.

### Scope boundaries

In scope: the nine public pages, the lead form, the ebook catalogue and
checkout, order fulfilment (download link by email), and the SEO and
accessibility baseline a public site needs.

Deferred until churn justifies it, and called out so nobody builds them by
reflex:

- **An admin CMS.** Marketing copy lives in code (section 10). Add an admin only
  when the coach needs to edit copy without a deploy. When that day comes, copy
  `portfolio`'s `src/app/admin` + `src/server` shape rather than inventing one.
- **Accounts and a customer portal.** Ebook delivery is a signed link by email.
  No login, no user table.
- **A separate Go backend.** The dynamic surface is two endpoints. They live in
  Next.js Route Handlers. A Go service would be infrastructure the site does not
  need; the Go conventions in section 12 apply only if that line is ever crossed.

---

## 2. Architecture

A single Next.js App Router application, deployed as one unit. Marketing pages
are statically generated. Two Route Handlers carry the only writes. One shared
database stores leads and orders. Stripe hosts checkout and delivers the webhook
that confirms payment.

```text
                         ┌─────────────────────────────────────────┐
   Visitor ── HTTPS ───▶ │  Next.js App (App Router, one deploy)     │
                         │                                           │
                         │  (marketing)  SSG pages ── render ──┐     │
                         │  (shop)       ebook pages           │     │
                         │                                     ▼     │
                         │  app/api/leads     ──┐        content/*   │
                         │  app/api/checkout  ──┼─▶ src/server/*     │
                         │  app/api/stripe/*  ──┘        │           │
                         └───────────────────────────────┼───────────┘
                                                          │
                              ┌───────────────────────────┼───────────────┐
                              ▼                            ▼               ▼
                        MongoDB (Docker)            Stripe Checkout    Email (Resend)
                        leads, orders               + webhook          enquiry + download
```

### Request shapes

- **A content page** (`/`, `/about`, `/online-coaching`, …) is generated at
  build time. No per-request work, no database call. It renders from the content
  modules in section 10.
- **A lead** is a `POST /api/leads`: validate, write one `Lead` document, send the
  coach a notification email, return 200. The form is the one piece of
  interactivity on an otherwise static page.
- **An ebook purchase** is `POST /api/checkout`: create a Stripe Checkout Session
  for the chosen ebook and redirect. Stripe hosts the card form — the site never
  sees card data (see the prohibited-actions rule: card entry is never ours).
  `POST /api/stripe/webhook` receives `checkout.session.completed`, writes one
  `Order`, and emails a time-limited download link.

### Why this shape

- **Static-first** gives the best performance and SEO for pages whose content is
  known at build time, and removes the database from the path of the pages people
  actually read.
- **Route Handlers over a separate service** keep the whole site in one
  repository, one deploy, one language. The write surface is too small to justify
  a service boundary.
- **Hosted checkout** keeps card data, PCI scope, and fraud handling with Stripe.
  The site stores only what it needs to fulfil and support an order.

---

## 3. Tech stack

Pinned to the versions the owner's current projects run, so a new checkout
matches the others. Match these in `package.json`; do not reach for a newer major
without a reason.

| Concern | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js App Router, React 19 | Same as `nitrate` and `portfolio`. |
| Language | TypeScript 5, `strict` | Path alias `@/*` → `./src/*`. |
| Styling | styled-components v6 | No Tailwind. SWC transform on (section 7). |
| Data fetching (client) | axios + SWR | Only the lead form and checkout button need it. |
| Validation | zod | One schema per request body, shared with the client. |
| Database | MongoDB via Mongoose | Shared Docker container, host port `27018`. |
| Email | Resend (or the owner's current provider) | Enquiry notice and ebook delivery. |
| Payments | Stripe Checkout + webhook | Hosted. No card data on our servers. |
| Lint and format | Biome | Config in section 11. No ESLint, no Prettier. |
| Unit tests | Vitest + Testing Library | Throwaway DB per run (section 12). |
| E2E | Playwright | Route-level smoke of every page and the lead form. |
| Package manager | pnpm | Matches `nitrate`. |

Do not add a dependency for something the platform or an installed package
already does. A few lines of code beat a new entry in `package.json`.

---

## 4. Folder structure

The `nitrate` layout, with a `src/content` directory for marketing copy and a
small `src/server` for the two write paths. `portfolio` is the reference for the
server side.

```text
src/
  app/                       Routes only; each page.tsx is a thin shell
    (site)/                  Route group for the public pages, with its layout.tsx
      page.tsx               Home
      about/page.tsx
      online-coaching/page.tsx
      in-person-coaching/page.tsx
      ebooks/page.tsx
      ebooks/[slug]/page.tsx
      testimonials/page.tsx
      faq/page.tsx
      contact/page.tsx
      legal/page.tsx
    api/
      leads/route.ts         POST a new enquiry
      checkout/route.ts      POST to start Stripe Checkout
      stripe/webhook/route.ts  Stripe payment confirmation
    layout.tsx               Root layout: fonts, GlobalStyle, metadata
    sitemap.ts               From the content modules and ebook slugs
    robots.ts
    not-found.tsx
  components/                Reusable UI, one PascalCase folder per component
    Button/
    Card/
    Field/
    Section/
    index.ts                 Barrel of named exports, sorted alphabetically
  layouts/                   Page chrome: SiteShell, Header, Footer
  libs/                      Page-level feature components: <Name>Wrapper/
    index.ts
  hooks/                     SWR hooks grouped by resource: Leads/, Checkout/
    index.ts
  constants/                 api.ts (axios instance), fetcher.ts (SWR fetcher), index.ts
  content/                   Marketing copy as typed modules (section 10)
    ebooks.ts
    testimonials.ts
    faq.ts
    plans.ts                 The "ways to train" cards
    index.ts
  server/                    The write surface only
    db/                      Mongoose connection (cached), per portfolio
    models/                  Lead, Order
    services/                leads.ts, orders.ts, stripe.ts, email.ts
    validators/              zod schemas shared with the client
  types/                     Shared types, barrel in index.ts
  styles/                    colors.ts, global.ts, motion.ts, index.ts
```

A route's `page.tsx` renders the matching wrapper from `src/libs` and nothing
else. A page that is pure static content may render its sections directly from
components and content modules instead of a wrapper — a wrapper earns its place
when there is client state (the contact form, the checkout button), not before.

```tsx
export default function ContactPage() {
	return (
		<Suspense>
			<ContactWrapper />
		</Suspense>
	);
}
```

---

## 5. Routing and pages

| Route | Rendering | Data |
| --- | --- | --- |
| `/` | Static | `content/plans`, `content/ebooks`, `content/testimonials` |
| `/about` | Static | `content` |
| `/online-coaching` | Static | `content` |
| `/in-person-coaching` | Static | `content` |
| `/ebooks` | Static | `content/ebooks` |
| `/ebooks/[slug]` | Static (`generateStaticParams` from the catalogue) | one ebook |
| `/testimonials` | Static | `content/testimonials` |
| `/faq` | Static | `content/faq` |
| `/contact` | Static shell, client form | posts to `/api/leads` |
| `/legal` | Static | `content` |

- Every page sets its own `metadata` (title, description, Open Graph). The home
  and ebook pages add JSON-LD (`Organization`, `Product`) for search.
- The primary call to action on every page is "Book a free call", pointing at
  `/contact`. Treat it as the one conversion goal.
- "Back to top" and in-page anchors (the home page's `#top`) are plain anchors,
  not router navigations.

---

## 6. Design patterns

These are the patterns to reach for. Each exists in `nitrate` or `portfolio`
already — reuse the pattern, do not reinvent it.

### Thin page, feature wrapper

Routing lives in `app/`. A `page.tsx` is a shell that renders one wrapper from
`src/libs`. Feature logic, layout, and client state live in the wrapper. This
keeps route files uniform and makes a feature testable without a router.

### Component = `index.tsx` + `styled.tsx`

Every component folder holds exactly `index.tsx` (the component) and `styled.tsx`
(its styles). Types go inline or in `@/types`. Components, wrappers, layouts, and
hooks use a **default export**; `styled.tsx` uses **named exports only**. The
barrel in `components/index.ts` re-exports defaults by name, sorted
alphabetically:

```ts
export { default as Button, type ButtonVariant } from "./Button";
export { default as Card } from "./Card";
export { default as Field } from "./Field";
```

### Styled suffix and transient props

Name every styled component with a `Styled` suffix and import it by name. Pass
style-only props as transient `$props` so they never reach the DOM. Interfaces
are prefixed `I`, type aliases `T`.

```tsx
// src/components/Button/styled.tsx
export type ButtonVariant = "primary" | "secondary" | "ghost";

export const ButtonStyled = styled.button<{ $variant: ButtonVariant; $block?: boolean }>`
	/* consume tokens, never hard-coded colour */
	background: var(--tw-accent);
	color: var(--tw-accent-ink);
`;

// src/components/Button/index.tsx
import { ButtonStyled, type ButtonVariant } from "./styled";
```

### Server/client boundary

Content pages are server components by default. A component carries `"use client"`
only when it needs browser APIs or React state — the contact form, the checkout
button, anything with an event handler. Keep the boundary as low in the tree as
possible so most of a page stays server-rendered. `styled.tsx` files are client
(`"use client"`), matching `nitrate`.

### Data fetching: one axios instance, SWR for reads

`src/constants/api.ts` builds one cached axios instance with
`withCredentials: true`. `src/constants/fetcher.ts` wraps it as the SWR fetcher.
Hooks in `src/hooks/<Resource>/` wrap `useSWR` with that fetcher; mutations use
the same instance. There is no second `fetch` helper.

The site reads almost nothing from the client — it is static copy — so SWR is
used mostly for the two mutations:

```ts
// src/hooks/Leads/index.ts
export function useSubmitLead() {
	return async (input: TLeadInput) => api().post("/api/leads", input);
}
```

### Validation at the boundary, shared schema

A zod schema in `src/server/validators` defines each request body. The Route
Handler parses with it before touching the database; the client form imports the
same schema for inline validation. One definition, both sides. A malformed body
is a 400, never a silent default.

### Service layer over models

Route Handlers stay thin: parse, call a service, map the result to a response.
Business logic (create a lead, fulfil an order, talk to Stripe or email) lives in
`src/server/services`. Models in `src/server/models` are Mongoose schemas and
nothing else. This mirrors `portfolio`'s `server/services` + `server/models`
split.

### Config in one place, fail closed

Every environment variable is read once, in `src/server/config` (or
`src/env.ts`), validated with zod at module load. A missing Stripe key or
database URL is a boot error, not a runtime surprise. A value gets a default only
when a safe default exists.

### Errors are wrapped and logged, never swallowed

When a handler maps an error to a generic HTTP message, it logs the underlying
error first. Wrap with context as it crosses a layer. A caught error that is
neither handled nor rethrown is a bug.

---

## 7. Design system and styling

### Tokens as CSS custom properties, prefix `--tw-`

No styled-components `ThemeProvider`. Declare design tokens as CSS custom
properties inside the `createGlobalStyle` block in `src/styles/global.ts`, and
consume them with `var(--tw-accent)`. Server components can read these tokens
too. Every token is prefixed `--tw-` so it can never collide with one from a
dependency. This is the `nitrate` `--nt-` system under a Train With Awad prefix,
and the owner's `claric` uses `--cl-` the same way.

```ts
// src/styles/global.ts
"use client";
import { createGlobalStyle } from "styled-components";
import { TW_ACCENT, TW_BG } from "@/styles/colors";

export const GlobalStyle = createGlobalStyle`
	:root {
		--tw-bg: ${TW_BG};
		--tw-surface: #14171c;
		--tw-text: #f4f5f7;
		--tw-muted: #a7aeba;
		--tw-accent: ${TW_ACCENT};
		--tw-accent-ink: #10130a;
		--tw-radius-sm: 10px;
		--tw-radius-pill: 999px;
		/* spacing, type scale, shadows, durations … */
	}
`;
```

### `colors.ts`: only what JavaScript must read

`src/styles/colors.ts` exports only the few values JavaScript reads at runtime —
the ones Next's `themeColor` metadata or a component prop needs before any
stylesheet applies — as `UPPER_SNAKE` constants. `global.ts` interpolates these
same constants where it declares the matching tokens, so CSS and JavaScript stay
one source.

```ts
export const TW_BG = "#0c0e12";
export const TW_ACCENT = "#e0a94a";
```

### Motion and media queries

`src/styles/motion.ts` holds keyframes and the `prefers-reduced-motion` branch;
import an effect from there rather than writing `@keyframes` in a component.
Write media queries inline in `styled.tsx`.

### SSR registry

`src/components/StyledComponentsRegistry/index.tsx` uses `ServerStyleSheet`,
`useServerInsertedHTML`, and `StyleSheetManager`, wired into the root layout.
`next.config.ts` sets `compiler.styledComponents` with `displayName` in
development only and `ssr: true`.

### Visual direction

The source copy sets the tone: strong, direct, athletic. A dark ground with a
warm accent (the amber already used in `nitrate`) fits a strength brand and
carries the "example session" cards and coach notes well. The example-session
block, the three "ways to train" cards, the numbered "how it works" steps, and
the testimonial quotes are the recurring layout units — build them as
components (`Section`, `Card`, `Stat`, `Step`, `Quote`) and compose pages from
them.

### Accessibility is not optional

- Every interactive control clears a 44px target on coarse pointers (see the
  `nitrate` Button).
- Colour contrast meets WCAG AA against the surface a token sits on; verify text
  tokens the way `nitrate`'s palette comments record.
- Focus-visible rings on every control; the lead form labels every field and
  announces errors.
- `prefers-reduced-motion` disables non-essential animation.

---

## 8. Data layer

One MongoDB instance, reused from the shared Docker container on host port
`27018`, with Train With Awad's own database name so it does not collide with
other projects. Connection settings come from env, validated at boot, matching
the running container exactly. Never assume a host-installed Mongo.

Two collections only:

```ts
// src/server/models/Lead.ts
// A booking enquiry from the contact form.
{
	name: string,
	email: string,
	phone?: string,
	mode: "online" | "in-person",   // which coaching the enquiry is about
	goal?: string,                   // free text from the form
	source?: string,                 // which page the form was on
	createdAt: Date,
}

// src/server/models/Order.ts
// A paid ebook order, written from the Stripe webhook.
{
	ebookSlug: string,
	email: string,
	amount: number,                  // minor units, from Stripe
	currency: string,
	stripeSessionId: string,         // idempotency key; unique index
	downloadToken: string,           // signed, time-limited
	fulfilledAt?: Date,
	createdAt: Date,
}
```

- The Mongoose connection is cached across hot reloads (the `portfolio` pattern)
  so a dev server does not open a new pool on every change.
- `stripeSessionId` carries a unique index so a webhook retry cannot write a
  second order. Fulfilment is idempotent.
- Marketing content is **not** in the database. Testimonials, ebook metadata, and
  FAQ entries are content modules (section 10). The database holds only what a
  visitor generates.

### Mongoose rule

Never use the deprecated `new` option on `findOneAndUpdate` /
`findByIdAndUpdate`. Use `returnDocument: "after"` or `"before"`.

---

## 9. The two dynamic flows

### Lead capture

1. The contact form (a client wrapper) validates against the shared zod schema.
2. `POST /api/leads` re-validates, calls `leads.create`, which writes one `Lead`
   and triggers `email.notifyCoach`.
3. The handler returns 200 with a thank-you payload; the form shows an honest
   success state. A failed email does not fail the request — the lead is already
   saved, and the email error is logged.

Submitting the form is an explicit user action, so no confirmation step is
needed beyond the user pressing send. Do not add a lead from any source other
than the form.

### Ebook purchase

1. "View ebook" → the ebook page → "Buy" posts to `POST /api/checkout` with the
   slug.
2. `checkout` looks the ebook up in `content/ebooks`, creates a Stripe Checkout
   Session with that price, and returns the session URL. The client redirects.
3. Stripe hosts the card form. The site never receives card details.
4. `POST /api/stripe/webhook` verifies the signature, handles
   `checkout.session.completed`, writes one `Order`, mints a signed download
   token, and emails the download link.
5. A download route validates the token and streams the file (or redirects to a
   signed object-storage URL). The link expires.

Prices live in `content/ebooks` and in Stripe; treat Stripe as the source of
truth for the amount charged and store what Stripe reports on the order. Never
ship a hard-coded sample price to a real checkout.

---

## 10. Content model: copy as typed modules

Marketing copy lives in `src/content` as typed TypeScript modules, not in a
database and not scattered through JSX. This keeps copy in version control,
type-checked, and editable in one place, without the weight of a CMS the coach
did not ask for.

```ts
// src/content/ebooks.ts
export interface IEbook {
	slug: string;
	title: string;
	blurb: string;
	priceGBP: number;      // display price; Stripe holds the charged price
	cover: string;
	stripePriceId: string;
}

export const EBOOKS: IEbook[] = [
	{ slug: "strength-foundations", title: "Strength Foundations", priceGBP: 9.99, /* … */ },
	{ slug: "eat-to-perform", title: "Eat to Perform", priceGBP: 7.99, /* … */ },
	{ slug: "train-anywhere", title: "Train Anywhere", priceGBP: 8.99, /* … */ },
];
```

Testimonials, the "ways to train" cards, the "how it works" steps, and FAQ
entries follow the same shape: one typed array per module, a barrel in
`content/index.ts`. `sitemap.ts` and `generateStaticParams` read these modules,
so adding an ebook or a testimonial is a one-file change that flows through the
build.

The rule from the owner's frontend conventions holds: where a page needs data
the content modules do not have, add the field, derive it, or show an honest
empty state. Never ship sample numbers as if they were real.

---

## 11. Code style

### TypeScript and naming

- `strict` TypeScript. No implicit `any` in app code.
- Interfaces prefixed `I` (`IProps`, `IEbook`), type aliases prefixed `T`
  (`TLeadInput`). Styled props are transient `$props`.
- Components, wrappers, layouts, hooks: default export. Styled components and
  content modules: named exports. Barrels re-export by name, alphabetically.
- Path alias `@/*` for every intra-`src` import; no deep relative chains.

### Biome

Biome is the only linter and formatter. No ESLint, no Prettier. Match
`nitrate`'s config: tab indentation, `indentWidth: 4`, `lineWidth: 120`, double
quotes, semicolons always, trailing commas all, `organizeImports: "on"`, and the
`next` and `react` domains.

```json
{
	"formatter": { "indentStyle": "tab", "indentWidth": 4, "lineWidth": 120 },
	"assist": { "actions": { "source": { "organizeImports": "on" } } },
	"linter": { "domains": { "next": "recommended", "react": "recommended" } },
	"javascript": { "formatter": { "quoteStyle": "double", "semicolons": "always", "trailingCommas": "all" } }
}
```

Scripts match the other projects: `dev`, `build`, `start`, `lint` (`biome check`),
`format` (`biome format --write`), `ts.check` (`tsc --noEmit`), `test`, `e2e`.

### Comments and prose

- Comment the *why* the code cannot show, in a line or two — the way the
  `nitrate` tokens and Button record the reason behind a value. Do not narrate
  what the code already says.
- All prose — comments, README, commit messages, PR descriptions, error strings,
  UI copy — follows Google's developer documentation style: lead with the point,
  second person, active voice, present tense. No "just", "simply", "easy", no
  filler, no figurative language, no `currently`/`new`. Conditions before
  instructions. Inclusive terms (`allowlist`, `primary`/`replica`). Sentence-case
  headings, serial commas, code font for anything typed.

### Go (only if a service is ever added)

The site has no Go. If the deferred Go backend is ever built, it follows the
owner's Go conventions: binaries in `cmd/<name>/`, everything else in
`internal/<package>/`, no `pkg/`; configuration from environment variables only,
read in one place, failing closed; `log/slog` configured once at startup; errors
wrapped with `fmt.Errorf("…: %w", err)` and never swallowed; table-driven tests
with `t.Run`; a uniquely named throwaway Postgres database created and dropped in
`t.Cleanup`; and an SPDX header on every file. Treat this as out of scope until
the two-endpoint write surface outgrows Route Handlers, which it is not expected
to.

---

## 12. Testing

- **Unit (Vitest + Testing Library).** Cover the lead validator, the checkout and
  webhook handlers (signature check, idempotency, order write), the service
  layer, and the content modules' shape. Test behaviour, not implementation.
- **A test never touches a real or development database.** Spin up a throwaway
  Mongo — `mongodb-memory-server` or a per-run database named with a unique
  prefix — point the suite at it, and drop it in `afterAll`/`t.Cleanup` so it is
  removed even when a test fails. Verify the target name before writing. Register
  teardown so an interrupted run still cleans up. If you find leaked `*-test-*`
  databases, remove them and fix the root cause.
- **Table-driven** where a test covers several cases of one function; plain for a
  single scenario.
- **E2E (Playwright).** Smoke every route for a 200 and its heading, submit the
  lead form against a test database and assert the success state, and start the
  checkout as far as the Stripe redirect (Stripe test mode, test keys, published
  test cards — never a real card). Run one Playwright context at a time on this
  machine; it is memory-heavy.
- New non-trivial logic ships with at least one test. Treat missing teardown as a
  bug, not a style nit.

---

## 13. SEO, performance, and operations

- **SEO.** Per-page `metadata`, `sitemap.ts` and `robots.ts` generated from the
  content modules, JSON-LD on the home and ebook pages, semantic headings, and
  descriptive link text. The site's job is to be found; treat SEO as a feature.
- **Performance.** Static generation keeps pages fast by default. Serve images
  through `next/image` with explicit dimensions, set `remotePatterns` to the few
  hosts actually used, and keep the client bundle small by holding the
  server/client boundary low. Target a green Core Web Vitals pass.
- **Config and secrets.** All configuration from env, validated at boot. Local
  development uses `.env.local` with sensible non-secret defaults; real secrets
  (Stripe keys, email keys, database URL) are never committed. Show any change to
  an existing env value and reconcile it before editing.
- **Observability.** Log server-side errors with context on every Route Handler.
  The Stripe webhook logs each event id it processes so a missed fulfilment is
  traceable.
- **Deploy.** One build, one deploy unit. Backing services (Mongo) run in Docker,
  reusing the shared container; the app points at it through env. Kill any dev
  server or background process you start when you finish.

---

## 14. Git and delivery

- Branch for every change (`feat/…`, `fix/…`, `chore/…`) cut from the tip of the
  default branch. Never commit to the default branch; never use a worktree. Merge
  through a pull request and let the owner review.
- Atomic commits: one coherent change each, subject `type(scope): present-tense
  sentence`, for example `feat(contact): record an enquiry and notify the coach`.
  No `Co-Authored-By` trailer.
- Keep a `HANDOFF.md` current as the entry point for a fresh session.

---

## 15. Conventions at a glance

| Decision | Rule |
| --- | --- |
| App shape | One Next.js App Router app, static-first, two write endpoints. |
| Routing | `app/` is routes only; a `page.tsx` renders one `src/libs` wrapper. |
| Component | `index.tsx` + `styled.tsx`; default export; `Styled` suffix; `$` transient props. |
| Styling | styled-components v6, no Tailwind, no `ThemeProvider`. |
| Tokens | CSS custom properties, `--tw-` prefix, in `global.ts`; JS-read values in `colors.ts`. |
| Data (client) | One axios instance + SWR fetcher; no second fetch helper. |
| Content | Typed modules in `src/content`; no CMS, no DB for copy. |
| Database | Shared Docker Mongo on `27018`, own DB name; `Lead` and `Order` only. |
| Payments | Stripe Checkout, hosted; the site never sees card data. |
| Validation | zod at the boundary, schema shared with the client, fail closed. |
| Lint/format | Biome only; tabs, width 4, line 120, double quotes, semicolons. |
| Tests | Vitest + Playwright; throwaway DB dropped in teardown; never a real DB. |
| Types | `IProps`/`TAlias`, `@/*` alias, `strict`. |
| Prose | Google developer documentation style, everywhere. |
| Git | Branch + PR, atomic commits, no worktree, no co-author trailer. |
| Deferred | Admin CMS, accounts, a Go backend — build only when the need is real. |
