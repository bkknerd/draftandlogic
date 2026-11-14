'use client';

import { useEffect, useState } from 'react';
import Wordmark from './Wordmark';
import { ArrowLink } from './Icons';
import { onReady } from './Loader';

/** items: [{label, href:'#work'}]. On pages other than home, links point back to the home sections. */
export default function Nav({ items, home = true }) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => onReady(() => setDrawn(true)), []);

  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      setHidden(y > 240 && y > last && !open);
      last = y;
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);

  const close = () => setOpen(false);
  const to = (href) => (home ? href : `/${href}`);
  const cta = items.find((i) => i.href === '#contact');
  const links = items.filter((i) => i !== cta);

  return (
    <header className={`nav ${hidden ? 'hide' : ''} ${scrolled || open ? 'scrolled' : ''}`}>
      <nav className="wrap nav-in" aria-label="Main">
        <a className="logo" href={home ? '#top' : '/'} aria-label={home ? 'Draft and Logic, back to top' : 'Draft and Logic home'}>
          <Wordmark draw={drawn} />
        </a>
        <button
          className={`menu-btn ${open ? 'is-open' : ''}`}
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="nav-list"
          onClick={() => setOpen(!open)}
        >
          <span aria-hidden="true" /><span aria-hidden="true" />
        </button>
        <ul id="nav-list" className={open ? 'open' : ''}>
          {links.map((n) => (
            <li key={n.href}>
              <a className="nl" href={to(n.href)} onClick={close}>
                <span className="nl-m"><span data-t={n.label}>{n.label}</span></span>
              </a>
            </li>
          ))}
          {cta && (
            <li>
              <ArrowLink href={to(cta.href)} variant="sm" className="nav-cta" onClick={close}>{cta.label}</ArrowLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
