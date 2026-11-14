'use client';

import { useReveal } from '@/lib/hooks';
import Wordmark from './Wordmark';

/** footer: content/site/footer.json */
export default function Footer({ footer, home = true }) {
  const [ref, shown] = useReveal(0.3);
  const top = home ? '#top' : '/';
  return (
    <footer className="foot">
      <div className="wrap">
        <a ref={ref} className="flogo" href={top} aria-label={home ? 'Draft and Logic, back to top' : 'Draft and Logic home'}>
          <Wordmark draw={shown} />
        </a>
        <div className="foot-grid">
          <div>
            <p className="k">Studio</p>
            <p>{footer.area}</p>
          </div>
          <div>
            <p className="k">Contact</p>
            <p>
              {footer.email && <a href={`mailto:${footer.email}`}>{footer.email}</a>}
              {footer.email && footer.phone && <br />}
              {footer.phone && <a href={`tel:${footer.phone}`}>{footer.phoneDisplay || footer.phone}</a>}
            </p>
          </div>
          <div>
            <p className="k">Elsewhere</p>
            <p>
              {footer.founderLinkedin && <a href={footer.founderLinkedin} target="_blank" rel="noopener">LinkedIn</a>}
              {footer.founderLinkedin && footer.github && <br />}
              {footer.github && <a href={footer.github} target="_blank" rel="noopener">GitHub</a>}
            </p>
          </div>
        </div>
        <div className="foot-base">
          <span>{footer.copyright} {footer.name}</span>
          <a href={top}>{home ? 'Back to top' : 'Home'}</a>
        </div>
      </div>
    </footer>
  );
}
