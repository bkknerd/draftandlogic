'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { DimArrow } from './Icons';
import Drafted from './Drafted';

/** All work: cards with a filter by the service delivered. */
export default function WorkGrid({ cases, allLabel = 'All', filterLabel = 'Filter by service', featuredLabel = 'Featured case study' }) {
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
              {shot ? <Drafted className="wcard-img" src={shot.thumb} draft={shot.draft} alt={shot.alt} /> : <span className="wcard-img"><span className="wcard-ph" /></span>}
              {c.featured && <span className="wcard-feat">{featuredLabel}</span>}
              <span className="wcard-top">
                <span className="wcard-name">{c.label}</span>
                {c.slug && <DimArrow />}
              </span>
              <span className="wcard-title">{c.title}</span>
              {c.featured && c.summary && <span className="wcard-sum">{c.summary}</span>}
              {c.tag && <span className="wcard-tag">{c.tag}</span>}
            </>
          );
          return (
            <li key={c.label} className={`wcard${c.featured ? ' wcard-lead' : ''}`}>
              {c.slug ? <Link href={`/work/${c.slug}/`}>{inner}</Link> : <div>{inner}</div>}
            </li>
          );
        })}
      </ul>
    </>
  );
}
