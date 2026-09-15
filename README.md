# Boulder Computational Solutions — Next.js

Landing page (option **1a — dark lab**) exported to a Next.js App Router project (TypeScript, React 18).

## Run it

```bash
cd nextjs-bcs
npm install
npm run dev
```

Then open http://localhost:3000.

## Build for production

```bash
npm run build
npm start
```

## Contact form

The "Get in touch" dialog posts to `app/api/contact/route.ts`, which sends the
message via [Resend](https://resend.com). Copy `.env.example` to `.env.local` and
fill in `RESEND_API_KEY` to run it locally.

**Before you have a domain:** Resend's shared `onboarding@resend.dev` sender can
only deliver to the address your Resend account is registered under, and it
rejects the entire send if any recipient is anyone else. So `CONTACT_TO` must be
that single address for now — it defaults to `jack.krebsbach@colorado.edu`.

Once a domain is verified in Resend, point `CONTACT_FROM` at it and widen
`CONTACT_TO` to the full founder list.

## Deploy (Vercel)

Import the repo at [vercel.com/new](https://vercel.com/new) — the framework is
detected automatically. Add `RESEND_API_KEY` (and `CONTACT_TO` for now) under
Settings → Environment Variables, for all three environments.

## Structure

```
nextjs-bcs/
├── app/
│   ├── api/contact/
│   │   └── route.ts    # contact form handler -> Resend
│   ├── globals.css     # resets, body background, link styles
│   ├── layout.tsx      # <html>, metadata, Google Fonts (Space Grotesk, JetBrains Mono, Public Sans)
│   └── page.tsx        # the full landing page
├── static/headshots/   # founder photos, imported by app/page.tsx
├── next.config.mjs
├── tsconfig.json
└── package.json
```

## Notes

- Styling is inline (matching the original HTML design 1:1). If you prefer Tailwind
  or CSS Modules, the section markup maps cleanly onto either.
- The page centers a fixed 1120px column, as in the design. To make it fully fluid/
  responsive, replace the fixed `maxWidth`/paddings with responsive units and add
  breakpoints for the nav, metric strip, capabilities, and team grids.
- Content (capabilities, team, industries) lives in typed arrays at the top of
  `app/page.tsx` — edit there.
- Headshots are imported directly in `app/page.tsx` so Next fingerprints and
  optimizes them; they are not served from `public/`.
# bcs
