'use client';

import { useEffect, useRef, useState } from 'react';
import { reducedMotion, useMediaQuery } from '@/lib/hooks';
import Reveal from './Reveal';
import { ArrowLink, DimArrow } from './Icons';

const caseHref = (c) => (c.slug ? `/work/${c.slug}/` : '/work/');

export default function Work({ work, cases, viewCase = 'Case study' }) {
  const [active, setActive] = useState(-1);
  const [shot, setShot] = useState(0);
  const fine = useMediaQuery('(hover: hover) and (pointer: fine) and (min-width: 901px)');
  const pv = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  // The preview trails the pointer and leans a little with its speed.
  useEffect(() => {
    if (!fine) return;
    let raf;
    const loop = () => {
      const p = pos.current, t = target.current;
      const k = reducedMotion() ? 1 : 0.14;
      const dx = (t.x - p.x) * k;
      p.x += dx;
      p.y += (t.y - p.y) * k;
      if (pv.current) {
        const rot = Math.max(-6, Math.min(6, dx * 0.12));
        pv.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) rotate(${rot}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [fine]);

  // While a row is held, alternate between its screenshots.
  useEffect(() => {
    if (active < 0) return;
    setShot(0);
    const n = cases[active].shots.length;
    if (n < 2) return;
    const id = setInterval(() => setShot((s) => (s + 1) % Math.min(n, 2)), 1400);
    return () => clearInterval(id);
  }, [active, cases]);

  const enter = (i, e) => {
    if (e) {
      target.current = { x: e.clientX, y: e.clientY };
      if (active < 0) pos.current = { ...target.current };
    }
    setActive(i);
  };

  return (
    <section id="work" className="work" aria-labelledby="work-h">
      <div className="wrap">
        <Reveal className="work-head">
          <h2 id="work-h" className="mask"><span>{work.heading}</span></h2>
          {work.intro && <p>{work.intro}</p>}
        </Reveal>

        <ul
          className={`cases ${active > -1 ? 'has-active' : ''}`}
          onPointerMove={(e) => { target.current = { x: e.clientX, y: e.clientY }; }}
          onPointerLeave={() => setActive(-1)}
        >
          {cases.map((c, i) => (
            <li key={c.label} className={`case ${active === i ? 'on' : ''}`}>
              <a href={caseHref(c)} onPointerEnter={(e) => enter(i, e)} onFocus={() => enter(i)} onBlur={() => setActive(-1)}>
                <span className="case-name">{c.label}</span>
                <span className="case-meta">
                  <span className="case-title">{c.title}</span>
                  {c.tag && <span className="case-tag">{c.tag}</span>}
                </span>
                <span className="case-go"><DimArrow /></span>
              </a>
              {c.shots[0] && (
                <div className="case-shot">
                  <img src={c.shots[0].thumb || c.shots[0].src} alt={c.shots[0].alt} loading="lazy" width="1440" height="900" />
                  <p>{c.summary}</p>
                </div>
              )}
            </li>
          ))}
        </ul>

        {fine && (
          <div ref={pv} className={`pv ${active > -1 ? 'show' : ''}`} aria-hidden="true">
            <div className="pv-in">
              {cases.map((c, i) =>
                c.shots.slice(0, 2).map((s, j) => (
                  <img key={s.src} src={s.src} alt="" loading="lazy" className={active === i && shot === j ? 'on' : ''} />
                ))
              )}
              <i className="reg tl" /><i className="reg tr" /><i className="reg bl" /><i className="reg br" />
              <span className="pv-cap">{active > -1 ? cases[active].label : ''}<span>{viewCase}</span></span>
            </div>
          </div>
        )}

        {work.allLink && (
          <p className="allwork"><ArrowLink href="/work/" variant="lg">{work.allLink}</ArrowLink></p>
        )}

        {work.alsoShow && (work.also || []).length > 0 && (
          <div className="also">
            <h3>{work.alsoHeading}</h3>
            <ul>
              {work.also.map((a) => (
                <li key={a.label}>
                  <a href={a.url} target="_blank" rel="noopener">
                    <span className="also-l">{a.label}</span>
                    <DimArrow />
                    <span className="sr"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
