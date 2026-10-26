# Handoff — Train With Awad

The entry point for a fresh session. For the full design and conventions, read
`docs/ARCHITECTURE.md`; for the approved screens, see `design/mockups/`.

## What this is

The marketing and ebook site for a strength coach, built as one Next.js App
Router app: static-first marketing pages, a lead-capture form, and ebook
checkout through Stripe. Dark theme, single amber accent.

## Run it locally

1. Start the shared Docker MongoDB (host port 27018). This project uses its own
   database, `train-with-awad`.
2. Copy `.env.example` to `.env.local`. The defaults point Mongo at 27018 and use
   placeholder Stripe and email keys, which make the app skip the real calls in
   development.
3. Install and run:

   ```bash
   pnpm install
   pnpm dev
   ```

   Open http://localhost:3000.

With placeholder keys, email sends are logged instead of sent and checkout
returns a 503 "not configured" — swap in real test keys to exercise those flows.
Production refuses to boot with placeholder keys (it fails closed).

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` / `pnpm start` | Production build and serve |
| `pnpm ts.check` | `tsc --noEmit` |
| `pnpm lint` / `pnpm format` | Biome check / format (pinned 1.9.4) |
| `pnpm test` | Vitest unit and integration tests |
| `pnpm e2e` | Playwright route smoke (dev server on port 3100, throwaway `-e2e` database) |

## Layout

- `src/app` — routes. `(site)` holds the public pages; `api` holds the four
  write endpoints (`leads`, `checkout`, `stripe/webhook`, `download`).
- `src/components`, `src/layouts` — the styled-components UI kit and site chrome.
- `src/content` — marketing copy as typed modules (no CMS).
- `src/server` — config, db, models (`Lead`, `Order`), zod validators, services.
- `src/styles` — design tokens in `global.ts`, JS-read values in `colors.ts`.

## Testing notes

Tests never touch the app database. Unit tests run against placeholder config;
integration tests create a unique throwaway database (`train-with-awad-itest-*`)
and drop it in teardown. The e2e run uses `train-with-awad-e2e` and drops it in
global teardown.

## Known shortcuts

- The download token is signed with `STRIPE_WEBHOOK_SECRET`. Add a dedicated
  `DOWNLOAD_TOKEN_SECRET` if token lifetime must survive a webhook-secret
  rotation. See `src/server/services/downloadToken.ts`.
- `GET /api/download` redirects a valid token to a static path under
  `/ebooks/<slug>.pdf`. Move the files to signed object storage before launch.

## Git

Work is on the `feat/app-implementation` branch. There is no remote yet, so open
a pull request once one is added; do not merge to the default branch directly.
