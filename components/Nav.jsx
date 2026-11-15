'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Wordmark from './Wordmark';
import { ArrowLink } from './Icons';
import { onReady } from './Loader';

/** items: [{label, href:'#work'}]. On pages other than home, links point back to the home sections. */
export default function Nav({ items, home = true }) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const path = usePathname();

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
  // Section anchors (#work) jump on home and point back to home elsewhere; page paths (/swoogo-development/) go straight there.
  const isPage = (href) => href.startsWith('/');
  const to = (href) => (isPage(href) || home ? href : `/${href}`);
  const NavTag = home ? 'a' : Link;
  const cta = items.find((i) => i.href === '#contact');
  const links = items.filter((i) => i !== cta);

  return (
    <header className={`nav ${hidden ? 'hide' : ''} ${scrolled || open ? 'scrolled' : ''}`}>
      <nav className="wrap nav-in" aria-label="Main">
        {home ? (
          <a className="logo" href="#top" aria-label="Draft & Logic, back to top"><Wordmark draw={drawn} /></a>
        ) : (
          <Link className="logo" href="/" aria-label="Draft & Logic home"><Wordmark draw={drawn} /></Link>
        )}
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
          {links.map((n) => {
            const Tag = isPage(n.href) ? Link : NavTag;
            const here = isPage(n.href) && path === n.href;
            return (
              <li key={n.href}>
                <Tag className="nl" href={to(n.href)} onClick={close} aria-current={here ? 'page' : undefined}>
                  <span className="nl-m"><span data-t={n.label}>{n.label}</span></span>
                </Tag>
              </li>
            );
          })}
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
