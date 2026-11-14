import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { ArrowLink } from '@/components/Icons';
import { getSite } from '@/lib/content';

export const metadata = { title: 'Page not found | Draft and Logic', robots: { index: false } };

export default function NotFound() {
  const s = getSite();
  const i = s.interface;
  return (
    <>
      <Nav items={s.nav.items} home={false} />
      <main id="main" className="page nf">
        <section className="wrap nf-in" id="top">
          <h1 id="hero-h" className="nf-h1">{i.notFoundHeading}<span>{i.notFoundAccent}</span></h1>
          <p className="page-lead">{i.notFoundText}</p>
          <p><ArrowLink href="/" variant="lg">{i.notFoundButton}</ArrowLink></p>
        </section>
      </main>
      <Footer footer={s.footer} home={false} />
    </>
  );
}
