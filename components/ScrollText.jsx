'use client';

import { useEffect, useRef } from 'react';

// Paragraphs whose words darken one by one as the block scrolls up through the viewport.
// Words start at the muted color, so the text is readable even before it fills.
export default function ScrollText({ paragraphs = [], className = 'about-copy' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.style.setProperty('--fill', 1); return undefined; }
    let raf = 0;
    const read = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the block's top reaches 85% of the screen, 1 when its bottom reaches 45%.
      const start = vh * 0.85;
      const end = vh * 0.45;
      const total = r.height + (start - end);
      const fill = Math.min(1, Math.max(0, (start - r.top) / total));
      el.style.setProperty('--fill', fill.toFixed(4));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);

  const words = paragraphs.map((p) => p.split(' '));
  const count = words.reduce((n, w) => n + w.length, 0);
  let i = 0;
  return (
    <div ref={ref} className={`${className} stx`}>
      {words.map((ws, pi) => (
        <p key={pi}>
          {ws.map((w, wi) => {
            const at = (i++ / count).toFixed(4);
            return <span key={wi} style={{ '--w': at }}>{w}{wi < ws.length - 1 ? ' ' : ''}</span>;
          })}
        </p>
      ))}
    </div>
  );
}
