'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { reducedMotion } from '@/lib/hooks';
import { ArrowLink, Handle } from './Icons';
import { onReady } from './Loader';

const PARK = 24; // where the handle rests after the intro wipe, in %

function Lines({ lines, outline = false }) {
  return lines.map(([a, b], i) => (
    <span key={i} className={`ln ${i === 1 && !outline ? 'ln-mut' : ''}`}>
      <span className="ln-in" style={{ '--d': `${i * 90}ms` }}>
        <span className="seg">{a}</span>{b && <> <span className="seg">{b}</span></>}
      </span>
    </span>
  ));
}

export default function Hero({ hero, labels }) {
  const lines = [hero.lines[0], hero.lines[1]];
  const [ready, setReady] = useState(false);
  const [x, setX] = useState(100);
  const box = useRef(null);
  const drag = useRef(false);
  const [settled, setSettled] = useState(false);

  // Waits for the opening screen to lift (or starts at once if it was skipped).
  useEffect(() => onReady(() => setReady(true)), []);

  // Once the lines have risen, drop the masks so no ascender or descender is ever clipped.
  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => setSettled(true), reducedMotion() ? 0 : 1500);
    return () => clearTimeout(id);
  }, [ready]);

  // The outline drawing is wiped into the built headline once, then the handle parks.
  useEffect(() => {
    if (!ready) return;
    if (reducedMotion()) { setX(PARK); return; }
    let raf;
    const t0 = performance.now() + 500;
    const dur = 1500;
    const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
    const tick = (t) => {
      const p = Math.max(0, Math.min(1, (t - t0) / dur));
      if (drag.current) return;
      setX(100 - (100 - PARK) * ease(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  const fromEvent = useCallback((e) => {
    const r = box.current.getBoundingClientRect();
    setX(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
  }, []);

  const onKey = (e) => {
    const step = e.shiftKey ? 20 : 5;
    const map = { ArrowLeft: -step, ArrowDown: -step, ArrowRight: step, ArrowUp: step };
    if (e.key in map) { e.preventDefault(); drag.current = true; setX((v) => Math.max(0, Math.min(100, v + map[e.key]))); }
    if (e.key === 'Home') { e.preventDefault(); setX(0); }
    if (e.key === 'End') { e.preventDefault(); setX(100); }
  };

  const built = Math.round(100 - x);

  return (
    <section className={`hero ${ready ? 'in' : ''} ${settled ? 'settled' : ''}`} id="top" aria-labelledby="hero-h">
      <div className="wrap hero-in">
        <div
          ref={box}
          className="dl"
          style={{ '--x': `${x}%` }}
          onPointerDown={(e) => { drag.current = true; e.currentTarget.setPointerCapture?.(e.pointerId); fromEvent(e); }}
          onPointerMove={(e) => { if (e.buttons && drag.current) fromEvent(e); }}
          onPointerUp={() => { drag.current = false; }}
          onPointerCancel={() => { drag.current = false; }}
        >
          <div className="dl-draft" aria-hidden="true"><Lines lines={lines} outline /></div>
          <h1 id="hero-h" className="dl-built"><Lines lines={lines} /></h1>
          <div className={`dl-x ${x < 12 || x > 88 ? 'edge' : ''}`}>
            <b />
            <span className="l">{labels.left}</span>
            <span className="r">{labels.right}</span>
            <button
              type="button"
              role="slider"
              aria-label={labels.aria}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={built}
              aria-valuetext={`${built}% ${labels.value}`}
              onKeyDown={onKey}
            >
              <Handle />
            </button>
          </div>
        </div>

        <div className="hero-row">
          <p>{hero.intro}</p>
          <div className="hcta">
            <ArrowLink href="#contact" variant="lg">{hero.cta}</ArrowLink>
            <ArrowLink href="#work">{hero.cta2}</ArrowLink>
          </div>
        </div>
        {hero.status && <p className="hero-foot">{hero.status}</p>}
      </div>
    </section>
  );
}
