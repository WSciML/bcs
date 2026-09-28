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
bcs/
├── app/
│   ├── api/contact/
│   │   └── route.ts        # contact form handler -> Resend
│   ├── components/
│   │   └── Vortex.tsx      # WebGL2 hero: self-similar vortex streamlines
│   ├── globals.css         # all page styles
│   ├── layout.tsx          # <html>, metadata, fonts (Mona Sans, Libertinus Math)
│   └── page.tsx            # the landing page
├── next.config.mjs
├── tsconfig.json
└── package.json
```

## Notes

- Content (capabilities, industries, statement) lives in arrays at the top of
  `app/page.tsx`.
- The hero draws streamlines of a Burgers-type vortex (radial inflow, axial
  outflow, swirl) as nested generations that contract by Λ = 4 − √2. Line counts
  drop on small screens, rendering pauses offscreen, and `prefers-reduced-motion`
  gets a single still frame.
- Libertinus Math's ⟩ glyph is blank in the Google Fonts build, so the faint
  equations draw it as a mirrored ⟨ (`.eq .flip`).
