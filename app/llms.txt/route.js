import { getSite, getStudy, getStudySlugs, trim, SITE_URL } from '@/lib/content';

export const dynamic = 'force-static';

// A plain-text brief for AI tools, built from the same content as the site.
export function GET() {
  const d = getSite();
  const L = ['# Draft and Logic', '', '> ' + d.seo.description, '', d.seo.orgIntro, ''];
  if (d.on.services) L.push('## Services', ...d.services.levels.map((l) => `- ${l.title}: ${[l.lead, l.text].filter(Boolean).join(' ')}`), '');
  if (d.on.work) {
    L.push('## Selected work');
    for (const slug of getStudySlugs()) {
      const st = getStudy(slug);
      L.push(`- [${st.title}](${SITE_URL}/work/${slug}/): ${trim(st.lead, 200)}`);
    }
    L.push('');
  }
  if (d.on.process) L.push('## How a project runs', ...d.process.steps.map((x) => `- ${x.title}: ${x.text}`), '');
  if (d.on.faq) L.push('## Common questions', ...d.faq.items.flatMap((f) => [`- ${f.q}`, `  ${f.a}`]), '');
  if (d.on.contact) {
    L.push('## Contact', `- Start a project: ${SITE_URL}/#contact`, `- ${d.contact.intro}`);
    if (d.footer.email) L.push(`- Email: ${d.footer.email}`);
    if (d.footer.phoneDisplay) L.push(`- Phone: ${d.footer.phoneDisplay}`);
    if (d.footer.area) L.push(`- ${d.footer.area}`);
    L.push('');
  }
  return new Response(L.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
