'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/track';

// Site-wide GA4 events, sent through the existing tag (nothing is sent for Do Not Track / GPC visitors).
// One click listener covers every page, so links added later are tracked without extra code.
//   email_click, phone_click   ways to reach us (key events)
//   cta_click                  "Book discovery", "Start a project" and other links to the contact section or intake
//   case_study_click           a link to /work/<project>/
//   service_page_click         a link to the Swoogo page or a city page
//   white_paper_download       a PDF link
//   client_site_click          a link out to a client's live site
//   view_section               work, services, process or contact comes into view (once per page view)
// Every click also carries link_location (nav, footer or the section it sits in) and link_text.
const SECTIONS = ['work', 'services', 'process', 'contact', 'faq'];

function where(a) {
  if (a.closest('header.nav, nav')) return 'nav';
  if (a.closest('footer')) return 'footer';
  const s = a.closest('section[id], header[id]');
  return s ? (s.id === 'top' ? 'top' : s.id) : 'page';
}

// The visible words of a link: screen-reader-only notes such as "(opens in a new tab)" are left out.
function words(a) {
  const c = a.cloneNode(true);
  c.querySelectorAll('.sr').forEach((x) => x.remove());
  c.querySelectorAll('span, br').forEach((x) => x.after(' '));
  return (c.textContent || a.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 60);
}

export default function SiteTrack() {
  const path = usePathname();

  useEffect(() => {
    const on = (e) => {
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      const p = { link_location: where(a), link_text: words(a), page_path: path };
      if (href.startsWith('mailto:')) return track('email_click', p);
      if (href.startsWith('tel:')) return track('phone_click', p);
      if (/\.pdf($|\?)/i.test(href)) return track('white_paper_download', { ...p, file: href.split('/').pop() });
      if (/^(\/?#contact|\/intake(\/|$))/.test(href)) return track('cta_click', p);
      const study = href.match(/^\/work\/([a-z0-9-]+)\/?$/);
      if (study) return track('case_study_click', { ...p, case: study[1] });
      if (/^\/(swoogo-development|web-design-[a-z-]+)\/?$/.test(href)) return track('service_page_click', { ...p, service_page: href.replace(/\//g, '') });
      if (/^https?:\/\//.test(href) && !href.includes('draftandlogic.com') && path.startsWith('/work/')) {
        return track('client_site_click', { ...p, link_domain: new URL(href).hostname.replace(/^www\./, '') });
      }
    };
    document.addEventListener('click', on, true);
    return () => document.removeEventListener('click', on, true);
  }, [path]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const seen = {};
    const io = new IntersectionObserver((list) => {
      list.forEach((x) => {
        const id = x.target.id;
        if (x.isIntersecting && !seen[id]) {
          seen[id] = 1;
          track('view_section', { section: id, page_path: path });
          io.unobserve(x.target);
        }
      });
    }, { rootMargin: '0px 0px -40% 0px' });
    SECTIONS.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [path]);

  return null;
}
