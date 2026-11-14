import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import Reveal from '@/components/Reveal';
import WorkGrid from '@/components/WorkGrid';
import { getSite, getCases, thumb, trim, SITE_URL } from '@/lib/content';
import { org, ldJson } from '@/lib/schema';

export function generateMetadata() {
  const { work } = getSite();
  const title = `${work.allHeading || 'All work'} | Draft and Logic`;
  const description = trim(work.allIntro || 'Client builds and concepts from Draft and Logic.', 158);
  return {
    title,
    description,
    alternates: { canonical: '/work/' },
    openGraph: { title, description, url: SITE_URL + '/work/', type: 'website', images: ['/og.png'] },
    twitter: { title, description },
  };
}

export default function WorkIndex() {
  const s = getSite();
  const cases = getCases().map((c) => ({ ...c, shots: c.shots.map((sh) => ({ ...sh, thumb: thumb(sh.src) })) }));
  const graph = [
    { '@type': 'CollectionPage', '@id': SITE_URL + '/work/#webpage', url: SITE_URL + '/work/', name: s.work.allHeading || 'All work', inLanguage: 'en-US' },
    { '@type': 'ItemList', itemListElement: cases.filter((c) => c.slug).map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, url: `${SITE_URL}/work/${c.slug}/` })) },
    org(),
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(graph) }} />
      <Nav items={s.nav.items} home={false} />
      <main id="main" className="page">
        <section className="wrap page-head" id="top">
          <Reveal>
            <h1 id="hero-h" className="page-h1 mask"><span>{s.work.allHeading || 'All work'}</span></h1>
            {s.work.allIntro && <p className="page-lead">{s.work.allIntro}</p>}
          </Reveal>
        </section>
        <section className="wrap page-body" aria-label="Projects">
          <WorkGrid cases={cases} allLabel={s.interface.filterAll} filterLabel={s.interface.filterLabel} />
        </section>
        <Contact contact={s.contact} email={s.footer.email} />
      </main>
      <Footer footer={s.footer} home={false} />
    </>
  );
}
