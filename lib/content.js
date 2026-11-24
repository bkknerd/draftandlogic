// Reads the same JSON files the Decap editor writes (content/site/*.json, content/case-studies/*.json).
// Server-only: pages load content at build time and pass it to components as props.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const jsonIn = (dir) => fs.readdirSync(path.join(ROOT, dir)).filter((f) => f.endsWith('.json'));

export const SITE_URL = 'https://draftandlogic.com';

let cache;
export function getSite() {
  if (cache) return cache;
  const d = {};
  for (const f of jsonIn('content/site')) d[f.replace(/\.json$/, '')] = read(`content/site/${f}`);
  const on = (k) => !d[k] || d[k].show !== false;
  d.on = Object.fromEntries(['work', 'services', 'process', 'faq', 'contact', 'partners'].map((k) => [k, on(k)]));
  // Menu items whose section is switched off in the editor drop out of the menu.
  const sectionOf = { '#work': 'work', '#services': 'services', '#stack': 'services', '#process': 'process', '#faq': 'faq', '#contact': 'contact' };
  d.nav.items = (d.nav.items || [])
    .map((i) => (i.href === '#stack' ? { ...i, href: '#services' } : i))
    .filter((i) => !sectionOf[i.href] || d.on[sectionOf[i.href]]);
  cache = d;
  return d;
}

/** Hero headline lines split so the last word can wrap on its own on phones. */
export function splitLine(s = '') {
  const i = s.trim().lastIndexOf(' ');
  return i < 0 ? [s, ''] : [s.slice(0, i), s.slice(i + 1)];
}

const SHORT = {
  'Technical SEO & Performance': 'SEO',
  'ADA Accessibility Compliance': 'ADA',
  'Content Management Systems': 'CMS',
  'Site Modernization & Audits': 'Audit',
  'Event & Program Portals': 'Events',
  'Custom Web Development': 'Build',
};
export const shortName = (t) => SHORT[t] || t.split(' ')[0];

/** Smaller copy of an upload when one exists (namc-f1.jpg -> namc-f1-sm.jpg). */
// Copies made by scripts/images.mjs before the build (public/gen). Each falls back to the upload itself.
const gen = (src = '', kind) => {
  const g = src.replace(/^\/uploads\//, '/gen/').replace(/\.[^.]+$/, `-${kind}.webp`);
  return g !== src && fs.existsSync(path.join(ROOT, 'public', g)) ? g : '';
};
/** Full-size modern copy (up to 1280px wide). */
export const web = (src) => gen(src, '1280') || src;
/** Small copy for cards and strips (640px wide). */
export const thumb = (src) => gen(src, '640') || src;
/** Line drawing of the same screen, or '' when there isn't one. */
export const draft = (src) => gen(src, 'draft');

export function getCases() {
  const { cases } = getSite();
  const list = (cases.items || []).map((c) => ({
    slug: c.study || '',
    featured: !!c.featured,
    label: c.label,
    tag: c.tag || '',
    title: c.title,
    summary: c.summary,
    services: c.services || [],
    home: !!c.home,
    group: c.group || '',
    shots: (c.shots || []).filter((s) => s && s.image).map((s) => ({ src: s.image, web: web(s.image), thumb: thumb(s.image), draft: draft(s.image), alt: s.alt || '' })),
  }));
  // The featured study leads everywhere work is listed; the rest keep the editor's order.
  return [...list.filter((c) => c.featured), ...list.filter((c) => !c.featured)];
}

/** Pixel size of a JPG or PNG in public/, read from the file header (no dependency). */
export function imageSize(src = '') {
  try {
    const b = fs.readFileSync(path.join(ROOT, 'public', src));
    if (b[0] === 0x89 && b[1] === 0x50) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
      i += 2 + b.readUInt16BE(i + 2);
    }
  } catch {}
  return { w: 1440, h: 900 };
}

/** How a screenshot is shown: wide (as is), phone (narrow and tall) or full (a whole-page capture that scrolls in its frame). */
export function shotShape(src) {
  const { w, h } = imageSize(src);
  const r = h / w;
  return { w, h, shape: r > 2.2 ? 'full' : r > 1.25 ? 'phone' : 'wide' };
}

export function getAreas() {
  return (getSite().areas?.items || []).filter((a) => a.slug && a.city);
}

export function getStudySlugs() {
  return jsonIn('content/case-studies').map((f) => f.replace(/\.json$/, ''));
}

export function getStudy(slug) {
  if (!getStudySlugs().includes(slug)) return null;
  const s = read(`content/case-studies/${slug}.json`);
  const card = getCases().find((c) => c.slug === slug) || null;
  // "Client: what we made" titles split into the client's name and the page headline.
  const cut = (s.title || '').indexOf(': ');
  const client = cut > 0 ? s.title.slice(0, cut) : (card && card.label) || '';
  const head = cut > 0 ? s.title.slice(cut + 2) : s.title || '';
  // Tag line "Café website, Morrisville, NC. Launching December 2026": first sentence is the kind of project, the rest a status.
  const parts = (s.tag || '').split(/\.\s+/).map((x) => x.replace(/\.$/, '').trim()).filter(Boolean);
  return {
    slug,
    card,
    client,
    headline: head.charAt(0).toUpperCase() + head.slice(1),
    kind: parts[0] || '',
    status: (card && card.tag) || parts.slice(1).join('. '),
    title: s.title,
    seoTitle: s.seoTitle || '',
    tag: s.tag || '',
    // The page opens with the same description the work cards use; summaryLead is the fallback.
    lead: (card && card.summary) || s.summaryLead || '',
    story: s.story || '',
    url: s.url || '',
    // Optional PDF (a white paper or write-up) linked beside Visit site.
    paper: s.paper && s.paper.file ? { label: s.paper.label || 'White paper (PDF)', file: s.paper.file } : null,
    accent: /^#[0-9a-f]{6}$/i.test(s.accent || '') ? s.accent : '',
    numbers: (s.numbers || []).filter((x) => x && x.value),
    numbersNote: s.numbersNote || '',
    numbersHeading: s.numbersHeading || '',
    layout: s.layout || '',
    statement: s.statement || '',
    brief: s.brief || '',
    closing: s.closing || '',
    platforms: (s.platforms || []).filter(Boolean),
    cms: s.cms && s.cms.title ? { ...s.cms, items: (s.cms.items || []).filter(Boolean), shots: (s.cms.shots || []).filter((x) => x && x.image).map((x) => ({ ...x, image: web(x.image) })) } : null,
    compare: (s.compare || []).filter((x) => x && x.before && x.after).map((x) => ({ ...x, before: web(x.before), after: web(x.after), beforeMobile: x.beforeMobile ? web(x.beforeMobile) : '', afterMobile: x.afterMobile ? web(x.afterMobile) : '' })),
    impact: (s.impact || []).filter((x) => x && x.value && x.text),
    impactNote: s.impactNote || '',
    goals: (s.goals || []).filter(Boolean),
    quote: s.quote && s.quote.text ? s.quote : null,
    features: (s.features || []).filter((f) => f && f.title).map((f) => (f.video ? { ...f, poster: f.image ? web(f.image) : '' } : { ...f, ...(f.image ? { ...shotShape(f.image), image: web(f.image) } : {}) })),
  };
}

/** For meta descriptions: whole sentences up to n characters, so the snippet never stops mid-thought. */
export const sentences = (t, n = 158) => {
  t = String(t || '').replace(/\s+/g, ' ').trim();
  if (t.length <= n) return t;
  let out = '';
  for (const x of t.match(/[^.!?]+[.!?]+(\s|$)/g) || []) {
    if ((out + x).trim().length > n) break;
    out += x;
  }
  return out.trim() || trim(t, n);
};

export const trim = (t, n) => {
  t = String(t || '').replace(/\s+/g, ' ').trim();
  if (t.length <= n) return t;
  const cut = t.slice(0, n - 1);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
};
