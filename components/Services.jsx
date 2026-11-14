'use client';

import { useState } from 'react';
import { useActiveStep } from '@/lib/hooks';
import Reveal from './Reveal';

/** services: { label, heading, levels: [{ title, lead, text, short }] } */
export default function Services({ services }) {
  const [ref, scrollActive] = useActiveStep();
  const [hover, setHover] = useState(-1);
  const active = hover > -1 ? hover : scrollActive;
  const levels = services.levels || [];
  const n = levels.length;

  return (
    <section id="services" className="sec dark services" aria-labelledby="svc-h">
      <div className="wrap">
        <Reveal>
          {services.label && <p className="label">{services.label}</p>}
          <h2 id="svc-h" className="lede">{services.heading}</h2>
        </Reveal>
        <div className="sx">
          <ul ref={ref} className="sx-l" onPointerLeave={() => setHover(-1)}>
            {levels.map((s, i) => (
              <li key={s.title} data-step={i} className={`lv ${active === i ? 'on' : ''}`} onPointerEnter={() => setHover(i)}>
                <h3>{s.title}</h3>
                <p>{s.lead}{s.text ? ` ${s.text}` : ''}</p>
              </li>
            ))}
          </ul>
          {/* The stack: one plate per service; the active one lifts out. */}
          <div className="iso" aria-hidden="true">
            <div className="iso-s">
              {levels.map((s, i) => (
                <div key={s.title} className={`ply ${active === i ? 'on' : 'dim'}`} style={{ '--k': n - 1 - i }}>
                  {s.short}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
