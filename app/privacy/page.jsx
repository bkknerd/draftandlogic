import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getSite, getAreas, SITE_URL } from '@/lib/content';

export function generateMetadata() {
  const { privacy } = getSite();
  return {
    title: `${privacy.heading} | Draft and Logic`,
    description: privacy.intro,
    alternates: { canonical: '/privacy/' },
    openGraph: { title: `${privacy.heading} | Draft and Logic`, description: privacy.intro, url: SITE_URL + '/privacy/' },
  };
}

export default function Privacy() {
  const s = getSite();
  const p = s.privacy;
  return (
    <>
      <Nav items={s.nav.items} home={false} />
      <main id="main" className="page prose-page">
        <section className="wrap page-head" id="top">
          <h1 id="hero-h" className="cs-h1">{p.heading}</h1>
          <p className="page-lead">{p.intro}</p>
          {p.updated && <p className="cs-tag">Last updated {p.updated}</p>}
        </section>
        <section className="wrap prose">
          {(p.sections || []).map((x) => (
            <div key={x.title}>
              <h2 className="cs-h3">{x.title}</h2>
              <p>{x.text}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer footer={s.footer} areas={getAreas()} home={false} />
    </>
  );
}
