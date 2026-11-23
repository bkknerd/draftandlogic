import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import Reveal from '@/components/Reveal';
import Drafted from '@/components/Drafted';
import { ArrowLink, DimArrow } from '@/components/Icons';
import { getSite, getAreas, getCases, thumb, trim, sentences, SITE_URL } from '@/lib/content';
import { org, ldJson, orgId } from '@/lib/schema';

// One page per town we serve (content/site/areas.json), e.g. /web-design-wake-forest-nc/.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAreas().map((a) => ({ area: a.slug }));
}

export function generateMetadata({ params }) {
  const a = getAreas().find((x) => x.slug === params.area);
  if (!a) return {};
  const title = `${a.heading} | Draft & Logic`;
  const description = a.description || sentences(a.intro);
  return {
    title,
    description,
    alternates: { canonical: `/${a.slug}/` },
    openGraph: { title, description, url: `${SITE_URL}/${a.slug}/`, type: 'website', images: ['/og.png'] },
    twitter: { card: 'summary_large_image', title, description, images: ['/og.png'] },
  };
}

export default function Area({ params }) {
  const a = getAreas().find((x) => x.slug === params.area);
  if (!a) notFound();
  const s = getSite();
  const all = getCases();
  const cases = (a.cases || []).map((slug) => all.find((c) => c.slug === slug)).filter(Boolean);
  const url = `${SITE_URL}/${a.slug}/`;
  const faq = (a.faq || []).filter((f) => f && f.q && f.a);
  const graph = [
    { '@type': 'WebPage', '@id': url + '#webpage', url, name: a.heading, description: trim(a.intro, 158), inLanguage: 'en-US', about: { '@id': orgId } },
    { '@type': 'Service', name: `Web design in ${a.city}, NC`, serviceType: 'Web design and development', provider: { '@id': orgId }, areaServed: { '@type': 'City', name: a.city, containedInPlace: { '@type': 'State', name: 'North Carolina' } } },
    org(),
    faq.length > 0 && { '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ].filter(Boolean);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(graph) }} />
      <Nav items={s.nav.items} home={false} />
      <main id="main" className="page area">
        <section className="wrap page-head" id="top">
          <Reveal>
            <h1 id="hero-h" className="cs-h1">{a.heading}</h1>
            <p className="page-lead">{a.intro}</p>
          </Reveal>
        </section>

        {(a.body || []).length > 0 && (
          <section className="wrap area-body">
            <Reveal>{a.body.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}</Reveal>
          </section>
        )}

        <section className="wrap area-cols">
          {(a.points || []).length > 0 && (
            <Reveal>
              <h2 className="cs-h3">What you get</h2>
              <ul className="cs-list">{a.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </Reveal>
          )}
          {s.on.services && (
            <Reveal delay={120}>
              <h2 className="cs-h3">{s.services.label || 'Services'}</h2>
              <ul className="cs-list">{s.services.levels.map((l) => <li key={l.title}>{l.title}</li>)}</ul>
            </Reveal>
          )}
        </section>

        {cases.length > 0 && (
          <section className="wrap cs-more" aria-labelledby="area-w">
            <div className="cs-more-head">
              <h2 id="area-w" className="cs-h2">Work</h2>
              <ArrowLink href="/work/">{s.work.allLink || 'See all work'}</ArrowLink>
            </div>
            <ul className="wgrid">
              {cases.map((c) => (
                <li key={c.slug} className="wcard">
                  <Link href={`/work/${c.slug}/`}>
                    {c.shots[0] ? <Drafted className="wcard-img" src={c.shots[0].thumb} draft={c.shots[0].draft} alt={c.shots[0].alt} /> : <span className="wcard-img" />}
                    <span className="wcard-top"><span className="wcard-name">{c.label}</span><DimArrow /></span>
                    <span className="wcard-title">{c.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {faq.length > 0 && (
          <section className="wrap area-faq" aria-labelledby="area-q">
            <h2 id="area-q" className="cs-h2">Questions from {a.city}</h2>
            <dl className="area-qa">
              {faq.map((f) => (
                <Reveal key={f.q}>
                  <dt className="cs-h3">{f.q}</dt>
                  <dd>{f.a}</dd>
                </Reveal>
              ))}
            </dl>
          </section>
        )}

        <Contact contact={s.contact} email={s.footer.email} />
      </main>
      <Footer footer={s.footer} areas={getAreas()} hideEmail home={false} />
    </>
  );
}
