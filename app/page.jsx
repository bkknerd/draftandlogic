import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Work from '@/components/Work';
import Partners from '@/components/Partners';
import Services from '@/components/Services';
import Process from '@/components/Process';
import Faq from '@/components/Faq';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { getSite, getCases, getAreas, splitLine, shortName, thumb, SITE_URL } from '@/lib/content';
import { org, ldJson, orgId } from '@/lib/schema';

export default function Home() {
  const s = getSite();
  const cases = getCases()
    .filter((c) => c.home)
    .map((c) => ({ ...c, shots: c.shots.map((sh) => ({ ...sh, src: sh.web })) }));
  const i = s.interface;

  const graph = [
    org(),
    { '@type': 'WebSite', '@id': SITE_URL + '/#website', url: SITE_URL + '/', name: 'Draft and Logic', inLanguage: 'en-US', publisher: { '@id': orgId } },
    s.on.work && {
      '@type': 'ItemList',
      name: s.work.heading,
      itemListElement: getCases().filter((c) => c.slug).map((c, n) => ({ '@type': 'ListItem', position: n + 1, name: c.label, url: `${SITE_URL}/work/${c.slug}/` })),
    },
    s.on.faq && {
      '@type': 'FAQPage',
      mainEntity: s.faq.items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ].filter(Boolean);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(graph) }} />
      <Nav items={s.nav.items} />
      <main id="main">
        <Hero
          hero={{ ...s.hero, lines: [splitLine(s.hero.line1), splitLine(s.hero.line2)] }}
          reel={s.on.work ? getCases().filter((c) => c.slug && c.shots[0]).map((c) => ({ slug: c.slug, label: c.label, src: c.shots[0].thumb, draft: c.shots[0].draft, alt: c.shots[0].alt })) : []}
        />
        {s.on.work && <Work work={s.work} cases={cases} viewCase="Case study" />}
        {s.on.partners && <Partners partners={s.partners} />}
        {s.on.services && <Services services={{ ...s.services, levels: s.services.levels.map((l) => ({ ...l, short: shortName(l.title) })) }} />}
        {s.on.process && (
          <Process
            process={s.process}
            mock={{ url: i.mockUrl, notes: i.mockLines.map((m) => m.text), states: i.mockStates.map((m) => m.text) }}
          />
        )}
        {s.on.faq && <Faq faq={s.faq} />}
        {s.on.contact && <Contact contact={s.contact} email={s.footer.email} />}
      </main>
      <Footer footer={s.footer} areas={getAreas()} />
    </>
  );
}
