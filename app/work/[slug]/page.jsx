import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import Reveal from '@/components/Reveal';
import Drafted from '@/components/Drafted';
import { DimArrow } from '@/components/Icons';
import { getAreas, getSite, getCases, getStudy, getStudySlugs, thumb, trim, SITE_URL } from '@/lib/content';
import { org, ldJson, orgId } from '@/lib/schema';

export const dynamicParams = false;

export function generateStaticParams() {
  return getStudySlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const st = getStudy(params.slug);
  if (!st) return {};
  const title = `${trim(st.title, 52)} | Draft & Logic`;
  const description = trim(st.lead, 158);
  const img = st.card?.shots[0]?.src || '/og.png';
  const url = `${SITE_URL}/work/${st.slug}/`;
  return {
    title,
    description,
    alternates: { canonical: `/work/${st.slug}/` },
    openGraph: { type: 'article', title, description, url, images: [{ url: img, alt: st.title }] },
    twitter: { title, description, images: [img] },
  };
}

/** Screens laid out in rows of one, two (7/5, the second set lower) and three; a whole-page capture sits beside a phone. */
function arrange(list) {
  const out = [];
  let buf = [];
  let turn = 0;
  const flush = () => {
    while (buf.length) {
      const chunk = buf.splice(0, [1, 2, 3][turn % 3]);
      const cls = chunk.length === 1 ? ['s12'] : chunk.length === 2 ? ['s7', 's5'] : ['s4', 's4', 's4'];
      chunk.forEach((f, k) => out.push({ ...f, cls: cls[k] }));
      turn++;
    }
  };
  for (let n = 0; n < list.length; n++) {
    const f = list[n];
    const tall = !f.video && (f.shape === 'full' || f.shape === 'phone');
    if (!tall) { buf.push(f); continue; }
    flush();
    const group = [f];
    while (list[n + 1] && !list[n + 1].video && (list[n + 1].shape === 'full' || list[n + 1].shape === 'phone')) group.push(list[++n]);
    const solo = group.length === 1;
    group.forEach((g) => out.push({ ...g, cls: solo ? 's12' : g.shape === 'full' ? 's8' : 's4' }));
  }
  flush();
  return out;
}

/** Text colour for the next-project band: whichever of white or ink reads better on the client's colour. */
function inkOn(hex) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return 1.05 / (L + 0.05) >= (L + 0.05) / 0.0545 ? '#FFFFFF' : '#0C0C0C';
}

export default function CaseStudy({ params }) {
  const st = getStudy(params.slug);
  if (!st) notFound();
  const s = getSite();
  const i = s.interface;
  const hero = st.card?.shots[0];
  const services = st.card?.services || [];
  const url = `${SITE_URL}/work/${st.slug}/`;

  // The next study in the work order, wrapping round, so every page leads on.
  const all = getCases().filter((c) => c.slug);
  const at = all.findIndex((c) => c.slug === st.slug);
  const next = all.length > 1 ? all[(at + 1) % all.length] : null;
  const nextStudy = next ? getStudy(next.slug) : null;
  const nb = (nextStudy && nextStudy.accent) || '#0C0C0C';

  const facts = [
    [i.csClient || 'Client', st.client],
    [i.csProject || 'Project', st.kind],
    [i.csStatus || 'Status', st.status],
  ].filter(([, v]) => v);
  // The hero already shows the first screen, so a feature with the same image isn't repeated.
  const shots = arrange(st.features.filter((f) => (f.image || f.video) && !(hero && f.image === hero.web && !f.video)));

  const graph = [
    { '@type': 'WebPage', '@id': url + '#webpage', url, name: st.title, description: trim(st.lead, 158), inLanguage: 'en-US', isPartOf: { '@id': SITE_URL + '/#website' }, about: { '@id': orgId }, breadcrumb: { '@id': url + '#crumbs' } },
    {
      '@type': 'BreadcrumbList',
      '@id': url + '#crumbs',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
        { '@type': 'ListItem', position: 2, name: 'Work', item: SITE_URL + '/work/' },
        { '@type': 'ListItem', position: 3, name: st.title, item: url },
      ],
    },
    { '@type': 'Article', '@id': url + '#article', headline: trim(st.title, 110), description: trim(st.lead, 158), image: hero ? SITE_URL + hero.src : SITE_URL + '/og.png', author: { '@id': orgId }, publisher: { '@id': orgId }, articleSection: 'Case study', keywords: services.join(', ') },
    org(),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(graph) }} />
      <Nav items={s.nav.items} home={false} />
      <main id="main" className="page cs" style={st.accent ? { '--accent': st.accent } : undefined}>
        <header className="wrap cs-head" id="top">
          <Link className="back" href="/work/"><DimArrow /><span>{i.csBackWork || 'All work'}</span></Link>
          <Reveal className="cs2-top">
            <h1 id="hero-h" className="cs-h1"><span className="sr">{st.client}: </span>{st.headline}</h1>
            <dl className="cs2-facts">
              {facts.map(([k, v]) => (
                <div key={k} style={{ display: 'contents' }}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
              {st.url && (
                <div style={{ display: 'contents' }}>
                  <dt>{i.csSite || 'Site'}</dt>
                  <dd><a href={st.url} target="_blank" rel="noopener">{st.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}<span className="sr"> (opens in a new tab)</span></a></dd>
                </div>
              )}
            </dl>
          </Reveal>
        </header>

        {hero && (
          <Reveal className="cs2-hero">
            <figure className="frame">
              <Drafted src={hero.web} draft={hero.draft} alt={hero.alt} eager />
            </figure>
          </Reveal>
        )}

        <div className="wrap">
          {(st.goals.length > 0 || services.length > 0) && (
            <section className="cs2-two" aria-label="Overview">
              {st.goals.length > 0 && (
                <Reveal>
                  <h2 className="cs-h3">{i.csGoals || 'Goals'}</h2>
                  <ul className="cs-list">{st.goals.map((g) => <li key={g}>{g.replace(/\.$/, '')}</li>)}</ul>
                </Reveal>
              )}
              {services.length > 0 && (
                <Reveal delay={120}>
                  <h2 className="cs-h3">{i.csDid || 'What we did'}</h2>
                  <ul className="cs-list">{services.map((g) => <li key={g}>{g}</li>)}</ul>
                </Reveal>
              )}
            </section>
          )}

          {st.numbers.length > 0 && (
            <section className="cs-nums" aria-labelledby="cs-n">
              <h2 id="cs-n" className="cs-h2">{i.csNumbers || 'By the numbers'}</h2>
              <dl>
                {st.numbers.map((n) => (
                  <div key={n.label}><dt>{n.label}</dt><dd>{n.value}</dd></div>
                ))}
              </dl>
            </section>
          )}

          {st.compare.length > 0 && (
            <section className="cs2-sec" aria-labelledby="cs-ba">
              <h2 id="cs-ba" className="cs-h2">{i.csCompare || 'Before and after'}</h2>
              {st.compare.map((c, n) => (
                <Reveal key={c.title} className="cs2-ba">
                  <div className="cs2-ba-h"><h3>{c.title}</h3><span>{String(n + 1).padStart(2, '0')}</span></div>
                  <div className="ba-pair">
                    {[['before', c.beforeImage, c.beforeAlt, i.csBefore || 'Before'], ['after', c.afterImage, c.afterAlt, i.csAfter || 'After']].map(
                      ([k, src, alt, tag]) =>
                        src && (
                          <figure key={k} className={`ba-fig ${k}`}>
                            <span className="frame"><img src={src} alt={alt || ''} loading="lazy" width="1440" height="900" /></span>
                            <figcaption className="ba-tag">{tag}</figcaption>
                          </figure>
                        )
                    )}
                  </div>
                </Reveal>
              ))}
            </section>
          )}

          {shots.length > 0 && (
            <section className="cs2-sec" aria-labelledby="cs-f">
              <h2 id="cs-f" className="cs-h2">{i.csFeatures || 'Features'}</h2>
              {/* The screens carry it: each image gets its title and nothing else. */}
              <div className="cs2-grid">
                {shots.map((f) => (
                  <Reveal as="figure" key={f.title} className={`shot ${f.video ? 'wide' : f.shape || 'wide'} ${f.cls}`}>
                    {f.video ? (
                      <span className="frame">
                        <video src={f.video} poster={f.poster || undefined} controls muted loop playsInline preload="metadata" aria-label={f.alt || f.title} />
                      </span>
                    ) : (
                      <span className="frame" tabIndex={f.shape === 'full' ? 0 : undefined} role={f.shape === 'full' ? 'group' : undefined} aria-label={f.shape === 'full' ? `${f.title}, full page, scrolls` : undefined}>
                        <img src={f.image} alt={f.alt || ''} loading="lazy" width={f.w} height={f.h} />
                      </span>
                    )}
                    <figcaption>{f.title}</figcaption>
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {st.quote && (
            <section className="cs-q" aria-label="Client quote">
              <blockquote>
                <p>{st.quote.text}</p>
                {st.quote.name && <footer>{st.quote.name}{st.quote.role ? `, ${st.quote.role}` : ''}</footer>}
              </blockquote>
            </section>
          )}
        </div>

        {next && (
          <Link href={`/work/${next.slug}/`} className="cs2-next" style={{ '--nb': nb, '--nf': inkOn(nb) }}>
            <span className="wrap">
              <small>{i.csNext || 'Next project'}</small>
              <strong>{next.label} <span aria-hidden="true">→</span></strong>
            </span>
          </Link>
        )}

        <Contact contact={s.contact} email={s.footer.email} />
      </main>
      <Footer footer={s.footer} areas={getAreas()} hideEmail home={false} />
    </>
  );
}
