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

The "Get in touch" dialog posts to `app/api/contact/route.ts`, which sends two
emails via [Resend](https://resend.com) from the verified `mail.bocompsol.com`
domain: the inquiry to `CONTACT_TO` (default `jack@bocompsol.com`), and a welcome
email back to the sender (`app/api/contact/welcome.ts`). Copy `.env.example` to
`.env.local` and fill in `RESEND_API_KEY` to run it locally.

## Deploy (Vercel)

Import the repo at [vercel.com/new](https://vercel.com/new) — the framework is
detected automatically. Add `RESEND_API_KEY` (and optionally `CONTACT_TO` /
`CONTACT_FROM`) under
Settings → Environment Variables, for all three environments.

## Structure

```
bcs/
├── app/
│   ├── api/contact/
│   │   ├── route.ts        # contact form handler -> Resend
│   │   └── welcome.ts      # welcome email sent to new inquiries
│   ├── components/
│   │   └── Vortex.tsx      # WebGL2 hero: self-similar vortex streamlines
│   ├── globals.css         # all page styles
│   ├── icon.svg            # favicon (+ favicon.ico, apple-icon.png rasterized from it)
│   ├── layout.tsx          # <html>, metadata, JSON-LD, fonts (Mona Sans, Libertinus Math)
│   ├── opengraph-image.tsx # link-preview card
│   ├── page.tsx            # the landing page
│   ├── robots.ts, sitemap.ts
│   └── site.ts             # canonical URL, title, description
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
