'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { reducedMotion } from '@/lib/hooks';
import { ArrowLink } from './Icons';
import { onReady } from './Loader';

/** hero: { kicker, lines: [[a,b],[a,b]], intro, cta, cta2, status }; reel: [{ slug, label, src, alt }] */
export default function Hero({ hero, reel = [] }) {
  const [ready, setReady] = useState(false);
  const [settled, setSettled] = useState(false);
  const strip = useRef(null);

  // Waits for the opening screen to lift (or starts at once if it was skipped).
  useEffect(() => onReady(() => setReady(true)), []);

  // Once the lines have risen, drop the masks so no ascender or descender is ever clipped.
  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => setSettled(true), reducedMotion() ? 0 : 1500);
    return () => clearTimeout(id);
  }, [ready]);

  // With a mouse, the strip of work slides sideways as the page scrolls. On touch screens it is swiped.
  useEffect(() => {
    const el = strip.current;
    if (!el || reducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let raf = 0;
    const move = () => {
      raf = 0;
      const max = Math.max(0, el.scrollWidth - el.parentElement.clientWidth);
      el.style.transform = `translate3d(${-Math.min(max, window.scrollY * 0.7)}px, 0, 0)`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(move); };
    move();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, [reel.length]);

  return (
    <section className={`hero ${ready ? 'in' : ''} ${settled ? 'settled' : ''}`} id="top" aria-labelledby="hero-h">
      <div className="wrap hero-in">
        {hero.kicker && <p className="hero-kicker">{hero.kicker}</p>}
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

      {reel.length > 0 && (
        <div className="reel" aria-label="Recent work">
          <ul ref={strip}>
            {reel.map((r, i) => (
              <li key={r.slug} style={{ '--n': i }}>
                <Link href={`/work/${r.slug}/`}>
                  <span className="reel-img">
                    <img src={r.src} alt={r.alt} width="1280" height="800" loading={i < 4 ? 'eager' : 'lazy'} />
                  </span>
                  <span className="reel-name">{r.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
