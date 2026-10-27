# Draft and Logic — draftandlogic.com

A static site with every piece of content editable in a CMS. Content lives in JSON files, a tiny dependency-free build script turns it into HTML, and Netlify runs that build on every push.

```
content/site/*.json     page sections (hero, services, work cards, process, contact, footer, SEO, nav ...)
content/case-studies/   the three case-study pages
src/index.template.html page layout, CSS and scripts
static/                 files copied as-is: admin/, uploads/, robots.txt, sitemap.xml, 404.html, og.png
build.mjs               content + template -> dist/ (generated, not committed)
```

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
1. Netlify → Add new site → Import an existing project → GitHub → pick the repo. Build command `node build.mjs` and publish directory `dist` are already set in `netlify.toml`.
2. Domain management → Add a domain → `draftandlogic.com`.
   - Easiest: use Netlify DNS and point your registrar's nameservers to the ones Netlify shows.
   - Or at your current DNS host: `A` record for `@` → `75.2.60.5`, `CNAME` for `www` → `YOUR-SITE.netlify.app` (confirm both in Netlify's domain panel).
3. HTTPS → Verify DNS and provision the free certificate. Make `draftandlogic.com` the primary domain.
4. Forms → the `contact` form appears after the first deploy. Add an email notification under Forms → Settings & notifications.

## Content manager (Decap CMS)
Editors work at `https://draftandlogic.com/admin/`. Each save is a commit to `main`; Netlify rebuilds and the change is live in about a minute.

One-time setup:
1. Edit `repo:` in `static/admin/config.yml` to your real `your-user/draftandlogic`.
2. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App. Homepage `https://draftandlogic.com`, callback `https://api.netlify.com/auth/done`. Copy the Client ID and generate a Client Secret.
3. Netlify → Site configuration → Access & security → OAuth → Install provider → GitHub, paste the ID and Secret.
4. Open `/admin/` and choose Login with GitHub. Editors need write access to the repo.

What editors can change: SEO and share text, navigation labels, hero, partner logos, approach, the seven services, work cards (add, remove, reorder, swap screenshots), other launched sites, process steps, contact form wording, footer, and the full text of each case study.

Adding another case study: copy a file in `content/case-studies/`, add a card in the CMS under Work cards with its Case study ID, and add the file to `static/admin/config.yml`. Each chapter picks one of the built-in demos (grain, score, type, sprite, intro, steps, edge, grid, sponsor, cal, patio, menu, pair, tab, climb, open); a brand-new demo needs code in `src/index.template.html`.

What stays in code: page design, the interactive demos inside case studies (editors pick which demo each chapter shows), the seven-level service drawing, and the four contact topic buttons (labels editable, count fixed).

Editing locally: change any JSON file, run `node build.mjs`, open `dist/index.html`. No install needed (Node 18+). Uploaded images go to `static/uploads/`. The CMS script is self-hosted (Decap CMS 3.8.4) so the strict Content-Security-Policy stays in place.

## After launch
- Open the live site with DevTools open and check the console for Content-Security-Policy violations (set in `netlify.toml`).
- Submit `https://draftandlogic.com/sitemap.xml` in Google Search Console.
- Test the contact form once and confirm the notification email arrives.

## Design notes

Fonts load from Google Fonts (Instrument Serif, Inter Tight, DM Mono), which the CSP in `netlify.toml` already allows. The palette and type tokens are at the top of the v3 block in `src/index.template.html`. Case-study pages share the same tokens.

## Pre-launch check

Run `node build.mjs` and confirm it finishes with no error. Deploy with the Netlify settings above, then open `/admin/` to confirm CMS login works.

## SEO and AEO

- Every case study has its own crawlable URL (`/work/<slug>/`) with its own title, description, canonical, Open Graph tags, Article and Breadcrumb schema, and a plain-text copy of the study inside `<noscript>` for crawlers that do not run JavaScript. Built by `build.mjs` from `content/case-studies/*.json`.
- Home page schema (Organization/ProfessionalService with the service catalog, WebSite, WebPage, ItemList, FAQPage) is generated from the CMS content, so it never drifts from the page.
- `sitemap.xml` and `llms.txt` are generated on every build. `robots.txt` explicitly allows search and AI crawlers.
- The FAQ section is editable in the CMS (FAQ). Its answers feed the FAQPage schema. Keep answers factual and short.
- The business address in the schema is city and state only (Wake Forest, NC). Remove `address` in `build.mjs` if you do not want it published.
- After deploy: add the site in Google Search Console and Bing Webmaster Tools, submit `sitemap.xml`, and run the Rich Results Test on the home page.

## Copy rules

Keep every edit in this voice.

- Positioning: high-performance web development and digital systems. Straightforward engineering over marketing fluff.
- Tone: direct, resourceful, transparent, technical without unnecessary jargon. Speak like a peer who understands systems, execution and clear business logic.
- No empty buzzwords, no hyperbole, no AI-sounding filler.
- Lead with the specific thing (what, how many, how fast). Frame technology as leverage for the client's goal. Cut adjectives.
- Say "key page", not "every page", unless it is true of every page.
- Do not state numbers, prices or timelines that are not real. Add proof (load times, results) only when it can be shown.
- Titles under 60 characters, search descriptions 140 to 158.

## Coming soon switch

In the CMS open **Site content > Coming soon switch** and turn on "Show the coming soon page". Save, and about a minute later:

- `/` shows the coming soon page (headline, message and an email signup form named `notify`, all editable there).
- The full site is still reachable at `/preview/` for checking, and `/admin/` keeps working.
- Every page is `noindex`, `robots.txt` disallows everything, and `sitemap.xml` and `llms.txt` are not published.

Turn it off to launch: the full site returns to `/`, and the sitemap, `llms.txt` and normal `robots.txt` come back. Signups appear in Netlify under Forms > notify. The setting lives in `content/site/launch.json` (`comingSoon`), so you can also flip it by editing that file.

## What is editable

Everything on the page text side is in the CMS: all sections, the case studies, SEO fields, the small text (buttons, labels, form messages, the 404 page) and the coming soon page. Not in the CMS, because they are code: the interactive demos inside case studies and the Approach section, colors, fonts and layout. Images are uploaded through the CMS media library.

## Turning sections on and off

Partner logos, Approach, Services, Work, Process, FAQ and Contact each have a "Show this section on the site" switch at the top of their CMS page (Work also has one for the "other launched sites" list). Switch one off, publish, and it leaves the page, the menu, the search structured data and `llms.txt`. If Work is off, the case-study pages are not published either. The hero and footer always show. If Contact is off, the hero button goes away too.
