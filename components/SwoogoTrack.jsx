'use client';

import { useEffect } from 'react';
import { track } from '@/lib/track';

// Swoogo page click events, sent through the site's existing GA4 tag.
// Links opt in with data-ga="event_name" and data-ga-loc="where on the page".
export default function SwoogoTrack() {
  useEffect(() => {
    const on = (e) => {
      const a = e.target.closest('[data-ga]');
      if (a) return track(a.dataset.ga, { cta_location: a.dataset.gaLoc || '', page_path: '/swoogo-development/' });
      // The closing section's email button comes from the shared Contact component.
      if (e.target.closest('#swoogo-contact a[href^="mailto:"]')) track('swoogo_cta_click', { cta_location: 'final', page_path: '/swoogo-development/' });
    };
    document.addEventListener('click', on);
    return () => document.removeEventListener('click', on);
  }, []);
  return null;
}
