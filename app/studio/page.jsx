import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import Reveal from '@/components/Reveal';
import Iceberg from '@/components/Iceberg';
import ScrollText from '@/components/ScrollText';
import Link from 'next/link';
import { getSite, getAreas, getCases, trim, SITE_URL } from '@/lib/content';
import { org, ldJson, orgId } from '@/lib/schema';

// Studio page. Copy lives in content/site/studio.json; the steps reuse content/site/process.json.
const url = `${SITE_URL}/studio/`;

export function generateMetadata() {
  const a = getSite().studio;
  const title = 'Studio | Draft & Logic';
  return {
    title,
    description: a.description,
    alternates: { canonical: '/studio/' },
    openGraph: { title, description: a.description, url, type: 'website', images: ['/og.png'] },
    twitter: { card: 'summary_large_image', title, description: a.description, images: ['/og.png'] },
  };
}


export default function Studio() {
  const s = getSite();
  const a = s.studio;
  const steps = (a.steps && a.steps.length ? a.steps : (s.process && s.process.steps)) || [];
  // A stat only shows once it has a real value; the section hides until at least one does.
  const stats = (a.stats || []).filter((st) => st.value && String(st.value).trim());
  const facts = (a.facts || []).filter((f) => f.q && f.a);
  // Client sites for the moving strip: the first screenshot of each case with one.
  const reel = getCases().filter((c) => c.shots[0]);
  const graph = [
    { '@type': 'AboutPage', '@id': url + '#webpage', url, name: a.heading, description: trim(a.description || a.lead, 158), inLanguage: 'en-US', about: { '@id': orgId } },
    org(),
    facts.length > 0 && { '@type': 'FAQPage', mainEntity: facts.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ].filter(Boolean);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(graph) }} />
      <Nav items={s.nav.items} home={false} />
      <main id="main" className="page area studio">
        <section className="wrap page-head" id="top">
          <Reveal>
            <h1 id="hero-h" className="st-h1">{a.heading}</h1>
            {a.lead && <p className="st-statement">{a.lead}</p>}
            {a.intro && <p className="page-lead">{a.intro}</p>}
          </Reveal>
        </section>

        {a.iceberg && <div className="wrap"><Iceberg data={a.iceberg} /></div>}

        {a.whatWeDo && (
          <section className="st-do" aria-labelledby="st-do-h">
            <div className="wrap">
              <Reveal>
                <h2 id="st-do-h" className="st-do-h">{a.whatWeDo.heading}</h2>
              </Reveal>
              <div className="st-do-row">
                <Reveal delay={100}><p className="st-do-text">{a.whatWeDo.text}</p></Reveal>
                {(a.whatWeDo.links || []).length > 0 && (
                  <Reveal delay={180} as="ul" className="st-do-links">
                    {a.whatWeDo.links.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
                  </Reveal>
                )}
              </div>
            </div>
            {reel.length > 0 && (
              <div className="st-reel" aria-label="Recent client sites">
                <ul className="st-reel-track">
                  {[...reel, ...reel].map((c, i) => (
                    <li key={`${c.slug}-${i}`} aria-hidden={i >= reel.length ? 'true' : undefined}>
                      <Link href={c.slug ? `/work/${c.slug}/` : '/work/'} tabIndex={i >= reel.length ? -1 : undefined}>
                        <img src={c.shots[0].thumb} alt={i >= reel.length ? '' : c.shots[0].alt} loading="lazy" width="560" height="350" />
                        <span>{c.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {(a.manifesto || []).length > 0 && (
          <section className="wrap st-mani" aria-label="What we believe">
            <ScrollText className="st-mani-text" paragraphs={a.manifesto} />
          </section>
        )}

        <section className="st-dark" aria-labelledby="ed-build-h">
          <div className="wrap">
            <h2 id="ed-build-h" className="st-dark-h">{s.services.heading}</h2>
            <ul className="st-rows">
              {s.services.levels.map((l) => (
                <Reveal as="li" key={l.title}>
                  <h3>{l.title}</h3>
                  <p>{l.lead}{l.linkHref && <> <Link href={l.linkHref}>{l.linkText}</Link></>}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {stats.length > 0 && (
          <section className="wrap st-stats" aria-labelledby="ed-stats-h">
            <div className="st-stats-head">
              <h2 id="ed-stats-h" className="cs-h2">{a.statsHeading}</h2>
              {a.statsNote && <p className="stats-note">{a.statsNote}</p>}
            </div>
            <dl className="stats">
              {stats.map((st) => <div key={st.label}><dt>{st.value}</dt><dd>{st.label}</dd></div>)}
            </dl>
          </section>
        )}

        {steps.length > 0 && (
          <section className="wrap st-steps" aria-labelledby="ed-steps-h">
            <h2 id="ed-steps-h" className="cs-h2">{a.processHeading}</h2>
            <ol className="st-step-row">
              {steps.map((st, i) => (
                <Reveal as="li" key={st.title} delay={i * 90}>
                  <h3>{st.title}</h3>
                  <p>{st.text}</p>
                </Reveal>
              ))}
            </ol>
          </section>
        )}

        {(a.values || []).length > 0 && (
          <section className="wrap st-values" aria-labelledby="ed-values-h">
            <h2 id="ed-values-h" className="cs-h2">{a.valuesHeading}</h2>
            <div className="st-values-grid">
              {a.values.map((v, i) => (
                <Reveal key={v.title} delay={i * 80} className="st-value">
                  <h3>{v.title}</h3>
                  <p>{v.text}</p>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {facts.length > 0 && (
          <section className="wrap about-split about-last" aria-labelledby="ed-facts-h">
            <Reveal><h2 id="ed-facts-h" className="cs-h2">{a.factsHeading || 'Good to know'}</h2></Reveal>
            <Reveal delay={80}>
              <dl className="area-qa">
                {facts.map((f) => <div key={f.q}><dt className="cs-h3">{f.q}</dt><dd>{f.a}</dd></div>)}
              </dl>
            </Reveal>
          </section>
        )}

        <Contact contact={s.contact} email={s.footer.email} />
      </main>
      <Footer footer={s.footer} areas={getAreas()} hideEmail home={false} />
    </>
  );
}
