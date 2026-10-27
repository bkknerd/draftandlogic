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
const on = (k) => !data[k] || data[k].show !== false;
const NAVMAP = { "#approach": "approach", "#stack": "services", "#work": "work", "#process": "process", "#faq": "faq", "#contact": "contact" };
data.nav.items = (data.nav.items || []).filter((i) => !NAVMAP[i.href] || on(NAVMAP[i.href]));

// Case studies: editor-friendly objects -> the array shapes the page script expects
const studies = {};
for (const f of list("content/case-studies")) {
  const s = rd("content/case-studies/" + f);
  studies[f.replace(/\.json$/, "")] = {
    title: s.title, tag: s.tag, shotSel: s.shotSel,
    summary: [s.summaryLead, s.summaryMore],
    chips: s.chips,
    stack: s.stack.map((r) => [r.name, r.detail]),
    chapters: s.chapters,
    stats: s.stats.map((r) => [r.value, r.label]),
    results: s.results.map((r) => [r.title, r.text]),
  };
}
data.studiesJson = JSON.stringify(studies).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");

// ---- SEO / AEO: structured data, per-study pages, sitemap, llms.txt ----
const SITE = "https://draftandlogic.com";
const ld = (o) => JSON.stringify(o).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
const orgId = SITE + "/#org";
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
    { "@type": "Article", "@id": url + "#article", headline: trim(st.title, 110), description: desc, image: img, mainEntityOfPage: { "@id": url + "#webpage" }, author: { "@id": orgId }, publisher: { "@id": orgId }, articleSection: "Case study", keywords: (st.chips || []).join(", ") },
    org,
  ];
  const ch = (raw.chapters || []).map((c) => "<h2>" + esc(c.title) + "</h2><h3>Challenge</h3><p>" + esc(c.challenge) + "</p><h3>Solution</h3><p>" + esc(c.solution) + "</p><h3>Outcome</h3><p>" + esc(c.outcome) + "</p>").join("");
  const stat = (raw.stats || []).map((r) => "<li>" + esc(r.value) + " " + esc(r.label) + "</li>").join("");
  const res = (raw.results || []).map((r) => "<li><b>" + esc(r.title) + ".</b> " + esc(r.text) + "</li>").join("");
  const stk = (raw.stack || []).map((r) => "<li><b>" + esc(r.name) + ":</b> " + esc(r.detail) + "</li>").join("");
  const plain = '<noscript><article><h1>' + esc(st.title) + '</h1><p>' + esc(raw.summaryLead) + '</p><p>' + esc(raw.summaryMore) + '</p><h2>Stack and architecture</h2><ul>' + stk + '</ul>' + ch + '<h2>Results and impact</h2><ul>' + stat + '</ul><ul>' + res + '</ul><p><a href="/">Draft and Logic home</a> | <a href="/#contact">Start a project</a></p></article></noscript>';
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

