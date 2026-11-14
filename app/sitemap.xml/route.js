import { getSite, getCases, getStudySlugs, SITE_URL } from '@/lib/content';

export const dynamic = 'force-static';

// Written by hand so each case study can carry its screenshot (image sitemap).
export function GET() {
  const { on } = getSite();
  const today = new Date().toISOString().slice(0, 10);
  const cards = getCases();
  const urls = [{ loc: `${SITE_URL}/`, pri: '1.0' }];
  if (on.work) {
    urls.push({ loc: `${SITE_URL}/work/`, pri: '0.9' });
    for (const slug of getStudySlugs()) {
      const img = cards.find((c) => c.slug === slug)?.shots[0]?.src;
      urls.push({ loc: `${SITE_URL}/work/${slug}/`, pri: '0.8', img: img ? SITE_URL + img : '' });
    }
  }
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' +
    urls
      .map((u) => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.pri}</priority>${u.img ? `<image:image><image:loc>${u.img}</image:loc></image:image>` : ''}</url>`)
      .join('\n') +
    '\n</urlset>\n';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
