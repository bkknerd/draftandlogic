'use client';

import { useEffect, useState } from 'react';
import { reducedMotion } from '@/lib/hooks';
import { ArrowLink } from './Icons';
import { onReady } from './Loader';

/** hero: { lines: [[a,b],[a,b]], intro, cta, cta2, status } */
export default function Hero({ hero }) {
  const [ready, setReady] = useState(false);
  const [settled, setSettled] = useState(false);

  // Waits for the opening screen to lift (or starts at once if it was skipped).
  useEffect(() => onReady(() => setReady(true)), []);

  // Once the lines have risen, drop the masks so no ascender or descender is ever clipped.
  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => setSettled(true), reducedMotion() ? 0 : 1500);
    return () => clearTimeout(id);
  }, [ready]);

  return (
    <section className={`hero ${ready ? 'in' : ''} ${settled ? 'settled' : ''}`} id="top" aria-labelledby="hero-h">
      <div className="wrap hero-in">
        <h1 id="hero-h" className="hero-h1">
          {hero.lines.map(([a, b], i) => (
            <span key={i} className={`ln ${i === 1 ? 'ln-mut' : ''}`}>
              <span className="ln-in" style={{ '--d': `${i * 90}ms` }}>
                <span className="seg">{a}</span>{b && <> <span className="seg">{b}</span></>}
              </span>
            </span>
          ))}
        </h1>

        <div className="hero-row">
          <p>{hero.intro}</p>
          <div className="hcta">
            <ArrowLink href="#contact" variant="lg">{hero.cta}</ArrowLink>
            <ArrowLink href="#work">{hero.cta2}</ArrowLink>
          </div>
        </div>
        {hero.status && <p className="hero-foot">{hero.status}</p>}
      </div>
    </section>
  );
}
