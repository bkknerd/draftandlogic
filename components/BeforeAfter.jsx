'use client';

import { useState } from 'react';

/** One screen over the other, with a handle to drag between the old site and the new one. */
export default function BeforeAfter({ before, after, beforeAlt = '', afterAlt = '', beforeLabel = 'Before', afterLabel = 'After', label = 'Compare the old and new site', eager = false }) {
  const [x, setX] = useState(50);
  return (
    <div className="bax" style={{ '--x': `${x}%` }}>
      <img className="bax-a" src={after} alt={afterAlt} width="1280" height="800" loading={eager ? 'eager' : 'lazy'} />
      <img className="bax-b" src={before} alt={beforeAlt} width="1280" height="800" loading={eager ? 'eager' : 'lazy'} />
      <span className="bax-t bax-tb" aria-hidden="true">{beforeLabel}</span>
      <span className="bax-t bax-ta" aria-hidden="true">{afterLabel}</span>
      <span className="bax-line" aria-hidden="true"><span className="bax-knob">
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 1 1 5l4 4M13 1l4 4-4 4" /></svg>
      </span></span>
      <input type="range" min="0" max="100" value={x} onChange={(e) => setX(+e.target.value)} aria-label={label} aria-valuetext={`${x}% ${beforeLabel.toLowerCase()}`} />
    </div>
  );
}
