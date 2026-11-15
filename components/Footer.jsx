'use client';

import Link from 'next/link';
import { useReveal } from '@/lib/hooks';
import Wordmark from './Wordmark';

/** footer: content/site/footer.json; areas: [{ slug, city }] for the local pages */
export default function Footer({ footer, areas = [], home = true }) {
  const [ref, shown] = useReveal(0.3);
  const label = home ? 'Draft and Logic, back to top' : 'Draft and Logic home';
  return (
    <footer className="foot">
      <div className="wrap">
        {home ? (
          <a ref={ref} className="flogo" href="#top" aria-label={label}><Wordmark draw={shown} /></a>
        ) : (
          <Link ref={ref} className="flogo" href="/" aria-label={label}><Wordmark draw={shown} /></Link>
        )}
        <div className={`foot-grid ${(footer.serviceLinks || []).length ? 'foot-grid-3' : ''}`}>
          <div>
            <p className="k">Studio</p>
            <p>{footer.area}</p>
            {areas.length > 0 && (
              <ul className="foot-areas">
                {areas.map((a) => (
                  <li key={a.slug}><Link href={`/${a.slug}/`}>Web design in {a.city}</Link></li>
                ))}
              </ul>
            )}
          </div>
          {(footer.serviceLinks || []).length > 0 && (
            <div>
              <p className="k">Services</p>
              <ul className="foot-areas foot-svc">
                {footer.serviceLinks.map((l) => (
                  <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <p className="k">Contact</p>
            <p>
              {footer.email && <a href={`mailto:${footer.email}`}>{footer.email}</a>}
              {footer.email && footer.phone && <br />}
              {footer.phone && <a href={`tel:${footer.phone}`}>{footer.phoneDisplay || footer.phone}</a>}
            </p>
          </div>
        </div>
        <div className="foot-base">
          <span>{footer.copyright} {footer.name}</span>
          <Link href="/privacy/">Privacy</Link>
          {home ? <a href="#top">Back to top</a> : <Link href="/">Home</Link>}
        </div>
      </div>
    </footer>
  );
}
