# Draft and Logic — draftandlogic.com

Static site. No build step. Everything served from `public/`.

## Put it on GitHub
```bash
cd draft-and-logic-netlify
git init -b main
git add .
git commit -m "Initial site"
# create an empty repo on github.com first, then:
git remote add origin https://github.com/YOUR-USER/draftandlogic.git
git push -u origin main
```

## Deploy on Netlify
1. Netlify → Add new site → Import an existing project → GitHub → pick the repo.
2. Build command: leave empty. Publish directory: `public` (already set in `netlify.toml`). Deploy.
3. Site configuration → Domain management → Add a domain → `draftandlogic.com`.
   - Easiest: use Netlify DNS and point your registrar's nameservers to the ones Netlify shows.
   - Or at your current DNS host: `A` record for `@` → `75.2.60.5`, `CNAME` for `www` → `YOUR-SITE.netlify.app` (confirm these values in Netlify's domain panel).
4. Domain management → HTTPS → Verify DNS and provision the free certificate. Set `draftandlogic.com` as the primary domain so `www` redirects to it.
5. Forms → the `contact` form appears after the first deploy. Add an email notification under Forms → Settings & notifications.

Every push to `main` redeploys automatically.

## News ticker
Headlines live in the `NEWS` array near the end of `public/index.html`. Each item is `[tag, headline, "Source · Month Year", link]`. It is hand-curated, not live, so refresh it every week or two.

## After launch
- Open the live site with DevTools open and check the console for Content-Security-Policy violations (set in `netlify.toml`).
- Submit `https://draftandlogic.com/sitemap.xml` in Google Search Console.
- Test the contact form once and confirm the notification email arrives.
