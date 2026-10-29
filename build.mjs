// Static build: content/*.json + src/index.template.html -> dist/
// No dependencies. Run: node build.mjs
import fs from "node:fs";
import path from "node:path";

const root = path.dirname(new URL(import.meta.url).pathname);
const rd = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const list = (d) => fs.readdirSync(path.join(root, d)).filter((f) => f.endsWith(".json"));

// ---- content ----
const data = {};
for (const f of list("content/site")) data[f.replace(/\.json$/, "")] = rd("content/site/" + f);
// Section switches (content/site/<section>.json -> show). Hidden sections leave the page, the nav, the schema and llms.txt.
// Google Analytics (content/site/analytics.json). Loaded on the live site only: never on the coming-soon page, 404 or admin.
// Visitors who send Do Not Track or Global Privacy Control are not measured.
const GA = data.analytics || {};
const gaId = /^G-[A-Z0-9]{6,14}$/.test(GA.measurementId || "") ? GA.measurementId : "";
data.analyticsHead = GA.enabled !== false && gaId && data.launch.comingSoon !== true
  ? "<script>(function(){var n=navigator;if(n.doNotTrack==='1'||window.doNotTrack==='1'||n.globalPrivacyControl)return;var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=" + gaId + "';document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','" + gaId + "',{anonymize_ip:true})})();</script>"
  : "";
// Coming-soon countdown: eight calendar cells ending on the launch date (content/site/launch.json -> launchDate, YYYY-MM-DD)
{
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data.launch.launchDate || "");
  const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], WDL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MO = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  data.launchDays = []; data.launchDaysLeft = ""; data.launchDateText = "";
  if (m) {
    const end = Date.UTC(+m[1], +m[2] - 1, +m[3]);
    for (let i = 7; i >= 0; i--) { const d = new Date(end - i * 864e5); data.launchDays.push({ iso: d.toISOString().slice(0, 10), wd: WD[d.getUTCDay()], d: d.getUTCDate(), go: i === 0 }); }
    const e = new Date(end); data.launchDateText = WDL[e.getUTCDay()] + ", " + MO[e.getUTCMonth()] + " " + e.getUTCDate();
    const t0 = new Date(); data.launchDaysLeft = String(Math.max(0, Math.round((end - Date.UTC(t0.getFullYear(), t0.getMonth(), t0.getDate())) / 864e5)));
  }
  const FQ = (data.launch.facts || []).filter((x) => x && x.text).map((x) => (x.kind ? x.kind + ": " : "") + x.text);
  data.launchQuips = JSON.stringify({ hello: data.launch.hello || "Back soon.", facts: FQ.length ? FQ : ["Back soon."] }).replace(/</g, "\\u003c");
}
const on = (k) => !data[k] || data[k].show !== false;
const NAVMAP = { "#approach": "approach", "#stack": "services", "#work": "work", "#process": "process", "#faq": "faq", "#contact": "contact" };
data.nav.items = (data.nav.items || []).filter((i) => !NAVMAP[i.href] || on(NAVMAP[i.href]));

// Case studies: editor-friendly objects -> the array shapes the page script expects
const studies = {};
for (const f of list("content/case-studies")) {
  const s = rd("content/case-studies/" + f);
  studies[f.replace(/\.json$/, "")] = {
    title: s.title, tag: s.tag,
    summary: s.summaryLead,
    story: s.story || "", url: s.url || "",
    numbers: (s.numbers || []).filter((x) => x && x.value).map((x) => [x.value, x.label]),
    goals: s.goals || [],
    quote: s.quote && s.quote.text ? [s.quote.text, s.quote.name || "", s.quote.role || ""] : null,
    img: ((s.features || []).find((x) => x.image) || {}).image || "",
    blurb: (((data.cases.items || []).find((c) => c.study === f.replace(/\.json$/, ""))) || {}).summary || "",
    services: ((data.cases.items || []).find((c) => c.study === f.replace(/\.json$/, "")) || {}).services || [],
    compare: (s.compare || []).map((c) => [c.title, c.beforeText || "", c.afterText || "", c.beforeImage || "", c.afterImage || "", c.beforeAlt || "", c.afterAlt || ""]),
    features: (s.features || []).map((f) => [f.title, f.text, f.image || "", f.alt || "", f.story || ""]),
  };
}
data.cardsJson = JSON.stringify((data.cases.items || []).map((c) => ({ slug: c.study || "", label: c.label, tag: c.tag || "", title: c.title, summary: c.summary, img: (c.shots && c.shots[0] && c.shots[0].image) || "", alt: (c.shots && c.shots[0] && c.shots[0].alt) || "", services: c.services || [] }))).replace(/</g, "\\u003c");
data.studiesJson = JSON.stringify(studies).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");

// ---- SEO / AEO: structured data, per-study pages, sitemap, llms.txt ----
const SITE = "https://draftandlogic.com";
const ld = (o) => JSON.stringify(o).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
const orgId = SITE + "/#org";
for (const it of data.cases.items || []) { it.svcList = (it.services || []).map((x) => ({ s: x })); it.svcAttr = (it.services || []).join("|"); }
const cardOf = (slug) => (data.cases.items || []).find((c) => c.study === slug);
const trim = (t, n) => { t = String(t).replace(/\s+/g, " ").trim(); if (t.length <= n) return t; const cut = t.slice(0, n - 1); return cut.slice(0, cut.lastIndexOf(" ")) + "\u2026"; };
const org = {
  "@type": ["ProfessionalService", "Organization"], "@id": orgId, name: "Draft and Logic", url: SITE + "/",
  description: data.seo.description, image: SITE + "/og.png",
  logo: { "@type": "ImageObject", url: SITE + "/favicon-192.png", width: 192, height: 192 },
  address: { "@type": "PostalAddress", addressLocality: "Wake Forest", addressRegion: "NC", addressCountry: "US" },
  areaServed: { "@type": "Country", name: "United States" },
  knowsAbout: data.seo.topics,
  hasOfferCatalog: !on("services") ? undefined : { "@type": "OfferCatalog", name: "Services", itemListElement: data.services.levels.map((l) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: l.title, description: l.lead + " " + l.text, provider: { "@id": orgId } } })) },
};
const homeGraph = [
  org,
  { "@type": "WebSite", "@id": SITE + "/#website", url: SITE + "/", name: "Draft and Logic", inLanguage: "en-US", publisher: { "@id": orgId } },
  { "@type": "WebPage", "@id": SITE + "/#webpage", url: SITE + "/", name: data.seo.title, description: data.seo.description, inLanguage: "en-US", isPartOf: { "@id": SITE + "/#website" }, about: { "@id": orgId }, primaryImageOfPage: { "@type": "ImageObject", url: SITE + "/og.png", width: 1200, height: 630 } },
  { "@type": "ItemList", name: data.work.heading, itemListElement: data.cases.items.filter((c) => c.study).map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, url: SITE + "/work/" + c.study + "/" })) },
  { "@type": "FAQPage", mainEntity: data.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
].filter((g) => !(g["@type"] === "ItemList" && !on("work")) && !(g["@type"] === "FAQPage" && !on("faq")));
data.ldHome = ld({ "@context": "https://schema.org", "@graph": homeGraph });

// ---- tiny template engine: {{x}} escaped, {{{x}}} raw, {{j:x}} JSON-escaped, {{#each x}}, {{#if x}}, this.y ----
const esc = (v) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
function parse(t) {
  const re = /\{\{\{\s*([^}]+?)\s*\}\}\}|\{\{\s*(#each|#if|\/each|\/if|j:)?\s*([^}]*?)\s*\}\}/g;
  const rootN = { c: [] }, st = [rootN];
  let last = 0, m;
  while ((m = re.exec(t))) {
    if (m.index > last) st.at(-1).c.push(t.slice(last, m.index));
    last = re.lastIndex;
    if (m[1]) { st.at(-1).c.push({ raw: m[1] }); continue; }
    const k = m[2], a = m[3];
    if (k === "#each" || k === "#if") { const n = { k, a, c: [] }; st.at(-1).c.push(n); st.push(n); }
    else if (k === "/each" || k === "/if") st.pop();
    else if (k === "j:") st.at(-1).c.push({ j: a });
    else st.at(-1).c.push({ v: a });
  }
  if (last < t.length) st.at(-1).c.push(t.slice(last));
  return rootN;
}
function val(a, scope) {
  const p = a.split("."); let cur, i = 0;
  if (p[0] === "this") { cur = scope.at(-1); i = 1; } else cur = scope[0];
  for (; i < p.length; i++) { if (cur == null) return undefined; cur = cur[p[i]]; }
  return cur;
}
function run(n, scope) {
  if (typeof n === "string") return n;
  if (n.c && !n.k) return n.c.map((x) => run(x, scope)).join("");
  if (n.raw !== undefined) { const v = val(n.raw, scope); if (v == null) throw new Error("Missing content: " + n.raw); return String(v); }
  if (n.j !== undefined) { const v = val(n.j, scope); if (v == null) throw new Error("Missing content: " + n.j); return JSON.stringify(String(v)).slice(1, -1).replace(/</g, "\\u003c").replace(/'/g, "\\u0027"); }
  if (n.v !== undefined) { const v = val(n.v, scope); if (v == null) throw new Error("Missing content: " + n.v); return esc(v); }
  if (n.k === "#each") { const arr = val(n.a, scope); if (!Array.isArray(arr)) throw new Error("Not a list: " + n.a); return arr.map((it) => n.c.map((x) => run(x, [...scope, it])).join("")).join(""); }
  if (n.k === "#if") { const v = val(n.a, scope); const ok = Array.isArray(v) ? v.length > 0 : Boolean(v); return ok ? n.c.map((x) => run(x, scope)).join("") : ""; }
  return "";
}

// ---- build ----
const out = process.env.OUT ? path.resolve(process.env.OUT) : path.join(root, "dist");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.cpSync(path.join(root, "static"), out, { recursive: true });
fs.mkdirSync(path.join(out, "content"), { recursive: true });
const render = (file) => {
  const h = run(parse(fs.readFileSync(path.join(root, file), "utf8")), [data]);
  if (/\{\{|\}\}\}/.test(h.replace(/<script[^>]*>[\s\S]*?<\/script>/g, ""))) throw new Error("Unresolved template tokens in " + file);
  return h;
};
// Launch switch: content/site/launch.json -> comingSoon. When true the home page is the coming-soon page,
// the full site moves to /preview/, and everything is hidden from search engines.
const soon = data.launch.comingSoon === true;
let html = render("src/index.template.html");
if (soon) html = html.replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex, nofollow">');
fs.writeFileSync(path.join(out, "404.html"), render("src/404.template.html"));
if (soon) {
  fs.mkdirSync(path.join(out, "preview"), { recursive: true });
  fs.writeFileSync(path.join(out, "preview", "index.html"), html);
  fs.writeFileSync(path.join(out, "index.html"), render("src/coming-soon.template.html"));
  fs.writeFileSync(path.join(out, "robots.txt"), "User-agent: *\nDisallow: /\n");
  fs.rmSync(path.join(out, "sitemap.xml"), { force: true });
  console.log("COMING SOON is ON: / shows the coming-soon page, full site at /preview/, search engines blocked");
} else {
  fs.writeFileSync(path.join(out, "index.html"), html);
}
console.log("Built dist/index.html (" + Math.round(html.length / 1024) + " KB)");
// ---- per-case-study pages: own URL, title, description, canonical, schema, plain-text content ----
const attr = (v) => esc(v);
const swap = (h, re, to) => { if (!re.test(h)) throw new Error("SEO swap missed: " + re); return h.replace(re, typeof to === "function" ? to : () => to); };
const sitemap = [{ loc: SITE + "/", pri: "1.0" }];
const today = new Date().toISOString().slice(0, 10);
for (const [slug, st] of Object.entries(on("work") ? studies : {})) {
  const raw = rd("content/case-studies/" + slug + ".json");
  const card = cardOf(slug);
  const url = SITE + "/work/" + slug + "/";
  const title = trim(st.title, 52) + " | Draft and Logic";
  const desc = trim(raw.summaryLead, 158);
  const img = card && card.shots && card.shots[0] ? SITE + card.shots[0].image : SITE + "/og.png";
  const graph = [
    { "@type": "WebPage", "@id": url + "#webpage", url, name: st.title, description: desc, inLanguage: "en-US", isPartOf: { "@id": SITE + "/#website" }, about: { "@id": orgId }, primaryImageOfPage: { "@type": "ImageObject", url: img }, breadcrumb: { "@id": url + "#crumbs" } },
    { "@type": "BreadcrumbList", "@id": url + "#crumbs", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" }, { "@type": "ListItem", position: 2, name: "Selected work", item: SITE + "/#work" }, { "@type": "ListItem", position: 3, name: st.title, item: url }] },
    { "@type": "Article", "@id": url + "#article", headline: trim(st.title, 110), description: desc, image: img, mainEntityOfPage: { "@id": url + "#webpage" }, author: { "@id": orgId }, publisher: { "@id": orgId }, articleSection: "Case study", keywords: (st.services || []).join(", ") },
    org,
  ];
  const feats = (raw.features || []).map((f) => "<li><b>" + esc(f.title) + ".</b> " + esc(f.text) + "</li>").join("");
  const plain = '<noscript><article><h1>' + esc(st.title) + '</h1><p>' + esc(raw.summaryLead) + '</p><h2>Features</h2><ul>' + feats + '</ul><p><a href="/">Draft and Logic home</a> | <a href="/#contact">Start a project</a></p></article></noscript>';
  let h = html;
  h = swap(h, /<title>[\s\S]*?<\/title>/, "<title>" + attr(title) + "</title>");
  h = swap(h, /<meta name="description" content="[^"]*">/, '<meta name="description" content="' + attr(desc) + '">');
  h = swap(h, /<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="' + url + '">');
  h = swap(h, /<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="' + url + '">');
  h = swap(h, /<meta property="og:type" content="website">/, '<meta property="og:type" content="article">');
  h = swap(h, /<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="' + attr(title) + '">');
  h = swap(h, /<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + attr(desc) + '">');
  h = swap(h, /<meta property="og:image" content="[^"]*">/, '<meta property="og:image" content="' + img + '">');
  h = swap(h, /<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">/, "");
  h = swap(h, /<meta property="og:image:alt" content="[^"]*">/, '<meta property="og:image:alt" content="' + attr(st.title) + '">');
  h = swap(h, /<meta name="twitter:title" content="[^"]*">/, '<meta name="twitter:title" content="' + attr(title) + '">');
  h = swap(h, /<meta name="twitter:description" content="[^"]*">/, '<meta name="twitter:description" content="' + attr(desc) + '">');
  h = swap(h, /<meta name="twitter:image" content="[^"]*">/, '<meta name="twitter:image" content="' + img + '">');
  h = swap(h, /<script type="application\/ld\+json" id="ld">[\s\S]*?<\/script>/, '<script type="application/ld+json" id="ld">' + ld({ "@context": "https://schema.org", "@graph": graph }) + "</script><script>if(!location.hash)history.replaceState(null,'','#/work/" + slug + "')</script>");
  h = swap(h, /<body([^>]*)>/, (m) => m + plain);
  fs.mkdirSync(path.join(out, "work", slug), { recursive: true });
  fs.writeFileSync(path.join(out, "work", slug, "index.html"), h);
  sitemap.push({ loc: url, pri: "0.8", img });
}

// ---- All work page: /work/ ----
if (on("work")) {
  const wk = data.work;
  const url = SITE + "/work/";
  const title = "All work | Draft and Logic";
  const desc = trim(wk.allIntro || "Client builds and concepts from Draft and Logic.", 158);
  const items = (data.cases.items || []);
  const graph = [
    { "@type": "CollectionPage", "@id": url + "#webpage", url, name: wk.allHeading || "All work", description: desc, inLanguage: "en-US", isPartOf: { "@id": SITE + "/#website" }, about: { "@id": orgId } },
    { "@type": "ItemList", itemListElement: items.filter((c) => c.study).map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, url: SITE + "/work/" + c.study + "/" })) },
    org,
  ];
  const plain = '<noscript><article><h1>' + esc(wk.allHeading || "All work") + '</h1><ul>' + items.map((c) => "<li>" + (c.study ? '<a href="/work/' + c.study + '/">' + esc(c.label) + "</a>" : esc(c.label)) + ": " + esc(c.summary) + "</li>").join("") + '</ul><p><a href="/">Draft and Logic home</a> | <a href="/#contact">Start a project</a></p></article></noscript>';
  let h = html;
  h = swap(h, /<title>[\s\S]*?<\/title>/, "<title>" + attr(title) + "</title>");
  h = swap(h, /<meta name="description" content="[^"]*">/, '<meta name="description" content="' + attr(desc) + '">');
  h = swap(h, /<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="' + url + '">');
  h = swap(h, /<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="' + url + '">');
  h = swap(h, /<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="' + attr(title) + '">');
  h = swap(h, /<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + attr(desc) + '">');
  h = swap(h, /<meta name="twitter:title" content="[^"]*">/, '<meta name="twitter:title" content="' + attr(title) + '">');
  h = swap(h, /<meta name="twitter:description" content="[^"]*">/, '<meta name="twitter:description" content="' + attr(desc) + '">');
  h = swap(h, /<script type="application\/ld\+json" id="ld">[\s\S]*?<\/script>/, '<script type="application/ld+json" id="ld">' + ld({ "@context": "https://schema.org", "@graph": graph }) + "</script><script>if(!location.hash)history.replaceState(null,'','#/work')</script>");
  h = swap(h, /<body([^>]*)>/, (m) => m + plain);
  fs.mkdirSync(path.join(out, "work"), { recursive: true });
  fs.writeFileSync(path.join(out, "work", "index.html"), h);
  sitemap.push({ loc: url, pri: "0.9" });
}
if (!soon) fs.writeFileSync(path.join(out, "sitemap.xml"), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' + sitemap.map((u) => "  <url><loc>" + u.loc + "</loc><lastmod>" + today + "</lastmod><priority>" + u.pri + "</priority>" + (u.img ? "<image:image><image:loc>" + u.img + "</image:loc></image:image>" : "") + "</url>").join("\n") + "\n</urlset>\n");

// ---- llms.txt: a plain-text brief for AI tools ----
const L = [];
L.push("# Draft and Logic", "", "> " + data.seo.description, "",
  data.seo.orgIntro, "",
  ...(on("services") ? ["## Services", ...data.services.levels.map((l) => "- " + l.title + ": " + l.lead + " " + l.text), ""] : []),
  ...(on("work") ? ["## Selected work"] : []), ...Object.entries(on("work") ? studies : {}).map(([k, v]) => "- [" + v.title + "](" + SITE + "/work/" + k + "/): " + trim(rd("content/case-studies/" + k + ".json").summaryLead, 200)), "",
  ...(on("process") ? ["## How a project runs", ...data.process.steps.map((x) => "- " + x.title + ": " + x.text), ""] : []),
  ...(on("faq") ? ["## Common questions", ...data.faq.items.flatMap((f) => ["- " + f.q, "  " + f.a]), ""] : []),
  ...(on("contact") ? ["## Contact", "- Start a project: " + SITE + "/#contact", "- " + data.contact.intro, ""] : []));
if (!soon) fs.writeFileSync(path.join(out, "llms.txt"), L.join("\n"));
console.log("Built " + Object.keys(studies).length + " case-study pages, sitemap.xml, llms.txt");


// Deploy stamp: open /build.txt on the live site to see exactly which commit Netlify built.
fs.writeFileSync(path.join(out, "build.txt"), "commit: " + (process.env.COMMIT_REF || "local build") + "\nbranch: " + (process.env.BRANCH || "n/a") + "\nbuilt: " + new Date().toISOString() + "\nhero: " + (data.hero && data.hero.intro ? data.hero.intro : "n/a") + "\ncomingSoon: " + (typeof soon !== "undefined" ? soon : "n/a") + "\n");
