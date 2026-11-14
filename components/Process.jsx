'use client';

import { useActiveStep } from '@/lib/hooks';
import Reveal from './Reveal';

const BLOCKS = ['b-nav', 'b-h', 'b-h2', 'b-img', 'b-c1', 'b-c2', 'b-c3', 'b-btn'];

/** process: { label, heading, why, steps:[{title,text}] }; mock: { url, notes:[], states:[4] } */
export default function Process({ process, mock }) {
  const [ref, active, setActive] = useActiveStep();
  const steps = process.steps || [];
  const pct = ((active + 1) / Math.max(1, steps.length)) * 100;

  return (
    <section id="process" className="sec dark process" aria-labelledby="pr-h">
      <div className="wrap">
        <Reveal>
          {process.label && <p className="label">{process.label}</p>}
          <h2 id="pr-h" className="lede">{process.heading}</h2>
          {process.why && <p className="why">{process.why}</p>}
        </Reveal>
        <div className="pr">
          {/* A page that gets built as the steps go by: notes, wireframe, then the real thing. */}
          <div className="pm" data-s={Math.min(active, 3)} aria-hidden="true">
            <div className="pm-bar"><i /><i /><i /><span>{mock.url}</span></div>
            <div className="pm-body">
              {BLOCKS.map((b) => <div key={b} className={`b ${b}`} />)}
              <div className="pm-n">{mock.notes.map((t) => <p key={t}>{t}</p>)}</div>
              <div className="pm-dim"><span>1280</span></div>
            </div>
            <div className="pm-st">
              <span className="pm-prog"><i style={{ width: `${pct}%` }} /></span>
              <span>{mock.states[Math.min(active, mock.states.length - 1)]}</span>
            </div>
          </div>
          <ol ref={ref} className="steps">
            {steps.map((s, i) => (
              <li key={s.title} data-step={i} className={`stp ${active === i ? 'on' : ''}`} onPointerEnter={() => setActive(i)}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
