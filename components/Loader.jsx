'use client';

import { useEffect, useState } from 'react';
import Wordmark from './Wordmark';
import { reducedMotion } from '@/lib/hooks';

const KEY = 'dl-intro-seen';

/** Opening screen: the wordmark draws itself, then the sheet lifts off.
 *  Plays once per browser session; skipped for reduced motion. */
export function markReady() {
  document.documentElement.classList.add('dl-ready');
  window.dispatchEvent(new Event('dl:ready'));
}

export function onReady(fn) {
  if (document.documentElement.classList.contains('dl-ready')) { fn(); return () => {}; }
  window.addEventListener('dl:ready', fn, { once: true });
  return () => window.removeEventListener('dl:ready', fn);
}

export default function Loader() {
  const [state, setState] = useState('on'); // on → out → gone

  useEffect(() => {
    const html = document.documentElement;
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === '1'; } catch {}
    if (seen || reducedMotion()) { setState('gone'); markReady(); return; }

    html.classList.add('dl-locked');
    const t1 = setTimeout(() => setState('out'), 1500);
    const t2 = setTimeout(() => {
      setState('gone');
      html.classList.remove('dl-locked');
      try { sessionStorage.setItem(KEY, '1'); } catch {}
    }, 2200);
    const t3 = setTimeout(markReady, 1700); // hero starts as the sheet lifts
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); html.classList.remove('dl-locked'); };
  }, []);

  if (state === 'gone') return null;
  return (
    <div className={`loader ${state === 'out' ? 'out' : ''}`} aria-hidden="true">
      <div className="loader-in">
        <Wordmark draw className="loader-wm" />
        <div className="loader-bar"><i /></div>
      </div>
    </div>
  );
}
