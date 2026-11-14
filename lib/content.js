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
export function thumb(src = '') {
  const t = src.replace(/\.jpg$/, '-sm.jpg');
  return t !== src && fs.existsSync(path.join(ROOT, 'public', t)) ? t : src;
}

export function getCases() {
  const { cases } = getSite();
  return (cases.items || []).map((c) => ({
    slug: c.study || '',
    label: c.label,
    tag: c.tag || '',
    title: c.title,
    summary: c.summary,
    services: c.services || [],
    home: !!c.home,
    shots: (c.shots || []).filter((s) => s && s.image).map((s) => ({ src: s.image, alt: s.alt || '' })),
  }));
}

export function getStudySlugs() {
  return jsonIn('content/case-studies').map((f) => f.replace(/\.json$/, ''));
}

export function getStudy(slug) {
  if (!getStudySlugs().includes(slug)) return null;
  const s = read(`content/case-studies/${slug}.json`);
  const card = getCases().find((c) => c.slug === slug) || null;
  return {
    slug,
    card,
    title: s.title,
    tag: s.tag || '',
    lead: s.summaryLead || '',
    story: s.story || '',
    url: s.url || '',
    numbers: (s.numbers || []).filter((x) => x && x.value),
    goals: (s.goals || []).filter(Boolean),
    quote: s.quote && s.quote.text ? s.quote : null,
    compare: (s.compare || []).filter((c) => c && (c.beforeImage || c.afterImage)),
    features: (s.features || []).filter((f) => f && f.title),
  };
}

export const trim = (t, n) => {
  t = String(t || '').replace(/\s+/g, ' ').trim();
  if (t.length <= n) return t;
  const cut = t.slice(0, n - 1);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
};
