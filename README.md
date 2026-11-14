# Draft and Logic — draftandlogic.com

Next.js 14 (App Router) built as a static site. Every word on the site still comes from the JSON files the Decap editor writes, so editing at `/admin/` works as before.

```
content/site/*.json       homepage sections, menu, footer, SEO, analytics, small labels
content/case-studies/     one file per case study, each becomes /work/<slug>/
app/                      pages: home, /work/, /work/[slug]/, 404, sitemap.xml, robots.txt, llms.txt, build.txt
components/               the page sections
lib/content.js            reads the JSON files at build time
public/                   files served as-is: admin/ (Decap), uploads/, intake/, favicons, og.png
netlify/functions/        form notification function
```

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
```

Netlify runs `npm run build` and publishes `out/` (set in `netlify.toml`).

## Editing

Editors work at `https://draftandlogic.com/admin/`. Each save is a commit to `main`; Netlify rebuilds and the change is live in about a minute. Images uploaded in the editor go to `public/uploads/`.

- A section's "show" switch in the editor removes it from the page, the menu, the schema and `llms.txt`.
- The coming-soon switch was removed from the editor. The site launched, and the new build doesn't have that page.

## Type

Matter is licensed and isn't in the repo. Add `Matter-Regular.woff2`, `Matter-Medium.woff2` and `Matter-Bold.woff2` to `public/fonts/` and the headings use it on the next build. Until then they use Helvetica Neue.

## Analytics

GA4 ID lives in `content/site/analytics.json`. Visitors who send Do Not Track or Global Privacy Control aren't measured.
