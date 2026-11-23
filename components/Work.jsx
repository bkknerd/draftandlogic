'use client';

import Link from 'next/link';
import { useState } from 'react';
import Reveal from './Reveal';
import { ArrowLink, DimArrow } from './Icons';

/** Work as a typographic index. The screen of whichever row is held shows in the panel beside it. */
export default function Work({ work, cases }) {
  const also = work.alsoShow ? (work.also || []).filter((a) => a.label && a.url) : [];
  const rows = [
    ...cases.map((c) => ({ key: c.label, label: c.label, meta: c.meta, href: c.slug ? `/work/${c.slug}/` : '/work/', shot: c.shots[0] })),
    ...also.map((a) => ({ key: a.label, label: a.label, meta: work.alsoHeading, href: a.url, out: true })),
  ];
  const [active, setActive] = useState(0);
  const cur = rows[active] || rows[0];

  return (
    <section id="work" className="work" aria-labelledby="work-h">
      <div className="wrap">
        <Reveal className="wk-head">
          <h2 id="work-h" className="mask"><span>{work.heading}</span></h2>
          {work.allLink && <div className="wk-head-r"><ArrowLink href="/work/">{work.allLink}</ArrowLink></div>}
        </Reveal>

        <div className="ix">
          <ol className="ix-list">
            {rows.map((r, n) => {
              const inner = (
                <>
                  <span className="ix-name">{r.label}</span>
                  {r.meta && <span className="ix-meta">{r.meta}</span>}
                  <span className="ix-go"><DimArrow /></span>
                  {r.out && <span className="sr"> (opens in a new tab)</span>}
                </>
              );
              const props = { onPointerEnter: () => setActive(n), onFocus: () => setActive(n) };
              return (
                <li key={r.key} className={`ix-row ${n === active ? 'on' : ''}`}>
                  {r.out ? <a href={r.href} target="_blank" rel="noopener" {...props}>{inner}</a> : <Link href={r.href} {...props}>{inner}</Link>}
                  {r.shot && (
                    <span className="ix-thumb" aria-hidden="true">
                      <img src={r.shot.thumb} alt="" loading="lazy" width="640" height="400" />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>

          <div className="ix-pv" aria-hidden="true">
            <div className="ix-pv-in">
              {rows.map((r, n) =>
                r.shot ? (
                  <img key={r.key} src={r.shot.src} alt="" width="1280" height="800" loading="lazy" className={n === active ? 'on' : ''} />
                ) : (
                  <span key={r.key} className={`ix-pv-ph ${n === active ? 'on' : ''}`}>{r.label}</span>
                )
              )}
            </div>
            <p className="ix-pv-cap"><span>{cur && cur.label}</span><span>{cur && (cur.out ? 'Visit site' : 'Case study')}</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}
