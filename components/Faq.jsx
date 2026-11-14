'use client';

import { useState } from 'react';
import Reveal from './Reveal';

export default function Faq({ faq }) {
  const [open, setOpen] = useState(-1);
  return (
    <section id="faq" className="sec faq" aria-labelledby="faq-h">
      <div className="wrap faq-grid">
        <Reveal>
          <p className="label">Questions</p>
          <h2 id="faq-h" className="lede">{faq.heading}</h2>
        </Reveal>
        <div className="faq-l">
          {(faq.items || []).map((f, i) => {
            const on = open === i;
            return (
              <div key={f.q} className={`qa ${on ? 'on' : ''}`}>
                <h3>
                  <button type="button" aria-expanded={on} aria-controls={`qa-${i}`} id={`qb-${i}`} onClick={() => setOpen(on ? -1 : i)}>
                    <span>{f.q}</span>
                    <i aria-hidden="true" />
                  </button>
                </h3>
                <div className="qa-a" id={`qa-${i}`} role="region" aria-labelledby={`qb-${i}`}>
                  <div><p>{f.a}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
