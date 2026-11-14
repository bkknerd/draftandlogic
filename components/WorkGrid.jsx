'use client';

import { useMemo, useState } from 'react';
import { DimArrow } from './Icons';

/** All work: cards with a filter by the service delivered. */
export default function WorkGrid({ cases, allLabel = 'All', filterLabel = 'Filter by service' }) {
  const [f, setF] = useState('');
  const services = useMemo(() => [...new Set(cases.flatMap((c) => c.services))], [cases]);
  const list = f ? cases.filter((c) => c.services.includes(f)) : cases;

  return (
    <>
      <div className="wfil" role="group" aria-label={filterLabel}>
        {[['', allLabel], ...services.map((s) => [s, s])].map(([k, l]) => (
          <button key={l} type="button" aria-pressed={f === k} onClick={() => setF(k)}>{l}</button>
        ))}
      </div>
      <p className="sr" role="status">{list.length} projects shown</p>
      <ul className="wgrid">
        {list.map((c) => {
          const shot = c.shots[0];
          const inner = (
            <>
              <span className="wcard-img">
                {shot ? <img src={shot.thumb || shot.src} alt={shot.alt} loading="lazy" width="1440" height="900" /> : <span className="wcard-ph" />}
              </span>
              <span className="wcard-top">
                <span className="wcard-name">{c.label}</span>
                {c.slug && <DimArrow />}
              </span>
              <span className="wcard-title">{c.title}</span>
              {c.tag && <span className="wcard-tag">{c.tag}</span>}
            </>
          );
          return (
            <li key={c.label} className="wcard">
              {c.slug ? <a href={`/work/${c.slug}/`}>{inner}</a> : <div>{inner}</div>}
            </li>
          );
        })}
      </ul>
    </>
  );
}
