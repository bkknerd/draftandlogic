'use client';

import { useEffect, useState } from 'react';
import { useReveal } from '@/lib/hooks';
import { onReady } from './Loader';

/** A screen that arrives as its own line drawing, then the built page wipes across it.
 *  `draft` is the drawing made from the same screenshot at build time; without one the image just shows. */
export default function Drafted({ src, draft, alt = '', width = 1280, height = 800, eager = false, delay = 0, className = '' }) {
  const [ref, shown] = useReveal(0.2);
  const [ready, setReady] = useState(false);
  useEffect(() => onReady(() => setReady(true)), []);
  return (
    <span ref={ref} className={`dr ${draft ? 'has-d' : ''} ${shown && ready ? 'in' : ''} ${className}`} style={{ '--dd': `${delay}ms` }}>
      {draft && <img className="dr-d" src={draft} alt="" aria-hidden="true" width={width} height={height} loading={eager ? 'eager' : 'lazy'} />}
      <img className="dr-r" src={src} alt={alt} width={width} height={height} loading={eager ? 'eager' : 'lazy'} />
      {draft && <i className="dr-l" aria-hidden="true" />}
    </span>
  );
}
