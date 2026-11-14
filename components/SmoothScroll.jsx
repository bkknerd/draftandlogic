'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { reducedMotion } from '@/lib/hooks';

/** Lenis smooth scroll, with in-page links routed through it and focus moved to the target. */
export default function SmoothScroll() {
  useEffect(() => {
    document.documentElement.classList.add('js');
    const lenis = reducedMotion() ? null : new Lenis({ lerp: 0.11 });
    let raf;
    if (lenis) {
      const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    }
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      const toTop = id === '#top';
      const el = toTop ? document.getElementById('top') : document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(toTop ? 0 : el, { offset: -72, duration: 1.1 });
      else window.scrollTo({ top: toTop ? 0 : el.getBoundingClientRect().top + window.scrollY - 72 });
      const f = toTop ? document.getElementById('hero-h') : el;
      if (f) { f.setAttribute('tabindex', '-1'); f.focus({ preventScroll: true }); }
      history.replaceState(null, '', toTop ? location.pathname : id);
    };
    document.addEventListener('click', onClick);
    return () => { document.removeEventListener('click', onClick); cancelAnimationFrame(raf); lenis?.destroy(); };
  }, []);
  return null;
}
