import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import Reveal from '@/components/Reveal';
import { ArrowLink, DimArrow } from '@/components/Icons';
import { getSite, getCases, getStudy, getStudySlugs, thumb, trim, SITE_URL } from '@/lib/content';
import { org, ldJson, orgId } from '@/lib/schema';

export const dynamicParams = false;

export function generateStaticParams() {
  return getStudySlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const st = getStudy(params.slug);
  if (!st) return {};
  const title = `${trim(st.title, 52)} | Draft and Logic`;
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

export default function CaseStudy({ params }) {
  const st = getStudy(params.slug);
  if (!st) notFound();
  const s = getSite();
  const i = s.interface;
  const hero = st.card?.shots[0];
  const services = st.card?.services || [];
  const url = `${SITE_URL}/work/${st.slug}/`;

  // Two more studies, starting after this one, so every page links onward.
  const withPages = getCases().filter((c) => c.slug && c.slug !== st.slug);
  const at = getCases().findIndex((c) => c.slug === st.slug);
  const more = [...withPages.filter((_, n) => n >= at), ...withPages].slice(0, 2);

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
      <main id="main" className="page cs">
        <header className="wrap cs-head" id="top">
          <a className="back" href="/work/"><DimArrow /><span>{i.csBackWork || 'All work'}</span></a>
          <Reveal>
            <p className="label">{[i.csBadge || 'Case study', st.card?.label].filter(Boolean).join(': ')}</p>
            <h1 id="hero-h" className="cs-h1">{st.title}</h1>
            <p className="page-lead">{st.lead}</p>
            {st.tag && <p className="cs-tag">{st.tag}</p>}
          </Reveal>
        </header>

        {hero && (
          <Reveal className="wrap cs-hero">
            <figure className="frame">
              <img src={hero.src} alt={hero.alt} width="1440" height="900" fetchPriority="high" />
            </figure>
          </Reveal>
        )}

        <section className="wrap cs-over" aria-label="Overview">
          <Reveal className="cs-story">
            {st.story && <p>{st.story}</p>}
            {st.url && <p className="cs-visit"><ArrowLink href={st.url} variant="lg">{i.csVisit || 'Visit site'}</ArrowLink></p>}
          </Reveal>
          <Reveal className="cs-side" delay={120}>
            {st.goals.length > 0 && (
              <>
                <h2 className="cs-h3">{i.csGoals || 'Goals'}</h2>
                <ul className="cs-list">{st.goals.map((g) => <li key={g}>{g}</li>)}</ul>
              </>
            )}
            {services.length > 0 && (
              <>
                <h2 className="cs-h3">{i.csDid || 'What we did'}</h2>
                <ul className="cs-list">{services.map((g) => <li key={g}>{g}</li>)}</ul>
              </>
            )}
          </Reveal>
        </section>

        {st.numbers.length > 0 && (
          <section className="wrap cs-nums" aria-labelledby="cs-n">
            <h2 id="cs-n" className="cs-h2">{i.csNumbers || 'By the numbers'}</h2>
            <dl>
              {st.numbers.map((n) => (
                <div key={n.label}><dt>{n.label}</dt><dd>{n.value}</dd></div>
              ))}
            </dl>
          </section>
        )}

        {st.compare.length > 0 && (
          <section className="wrap cs-ba" aria-labelledby="cs-ba">
            <h2 id="cs-ba" className="cs-h2">{i.csCompare || 'Before and after'}</h2>
            {st.compare.map((c) => (
              <Reveal key={c.title} className="ba">
                <h3 className="cs-h3">{c.title}</h3>
                <div className="ba-pair">
                  {[['before', c.beforeImage, c.beforeAlt, c.beforeText, i.csBefore || 'Before'], ['after', c.afterImage, c.afterAlt, c.afterText, i.csAfter || 'After']].map(
                    ([k, src, alt, text, tag]) =>
                      src && (
                        <figure key={k} className={`ba-fig ${k}`}>
                          <span className="ba-tag">{tag}</span>
                          <span className="frame"><img src={thumb(src)} alt={alt || ''} loading="lazy" width="1440" height="900" /></span>
                          {text && <figcaption>{text}</figcaption>}
                        </figure>
                      )
                  )}
                </div>
              </Reveal>
            ))}
          </section>
        )}

        {st.features.length > 0 && (
          <section className="wrap cs-feats" aria-labelledby="cs-f">
            <h2 id="cs-f" className="cs-h2">{i.csFeatures || 'Features'}</h2>
            {st.features.map((f, n) => (
              <Reveal key={f.title} className={`feat ${n % 2 ? 'rev' : ''}`}>
                {f.image && (
                  <figure className="frame">
                    <img src={thumb(f.image)} alt={f.alt || ''} loading="lazy" width="1440" height="900" />
                  </figure>
                )}
                <div className="feat-t">
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                  {f.story && <p className="feat-s">{f.story}</p>}
                </div>
              </Reveal>
            ))}
          </section>
        )}

        {st.quote && (
          <section className="wrap cs-q" aria-label="Client quote">
            <blockquote>
              <p>{st.quote.text}</p>
              {st.quote.name && <footer>{st.quote.name}{st.quote.role ? `, ${st.quote.role}` : ''}</footer>}
            </blockquote>
          </section>
        )}

        {more.length > 0 && (
          <section className="wrap cs-more" aria-labelledby="cs-m">
            <div className="cs-more-head">
              <h2 id="cs-m" className="cs-h2">{i.csRelated || 'More work'}</h2>
              <ArrowLink href="/work/">{i.csBackAll || 'All work'}</ArrowLink>
            </div>
            <ul className="wgrid">
              {more.map((c) => (
                <li key={c.slug} className="wcard">
                  <a href={`/work/${c.slug}/`}>
                    <span className="wcard-img">{c.shots[0] && <img src={thumb(c.shots[0].src)} alt={c.shots[0].alt} loading="lazy" width="1440" height="900" />}</span>
                    <span className="wcard-top"><span className="wcard-name">{c.label}</span><DimArrow /></span>
                    <span className="wcard-title">{c.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Contact contact={s.contact} email={s.footer.email} />
      </main>
      <Footer footer={s.footer} home={false} />
    </>
  );
}
