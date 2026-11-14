'use client';

import { useState } from 'react';
import { useReveal } from '@/lib/hooks';
import { ArrowLink } from './Icons';

/** contact: { heading, intro, button }; email from footer.json */
export default function Contact({ contact, email, id = 'contact', heading }) {
  const [copied, setCopied] = useState(false);
  const [ref, shown] = useReveal(0.25);
  const words = (heading || contact.heading || '').split(' ');
  const cut = Math.max(1, Math.ceil(words.length / 2));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard refused; the address is on screen */
    }
  };

  return (
    <section id={id} className="contact" aria-labelledby={`${id}-h`}>
      <div ref={ref} className={`wrap contact-in ${shown ? 'in' : ''}`}>
        <h2 id={`${id}-h`}>
          <span className="mask"><span>{words.slice(0, cut).join(' ')}</span></span>{' '}
          <span className="mask"><span style={{ '--d': '90ms' }}>{words.slice(cut).join(' ')}</span></span>
        </h2>
        <div className="contact-row">
          <p>{contact.intro}</p>
          <div className="contact-act">
            <ArrowLink href={`mailto:${email}`} variant="ink">{contact.button || 'Email us'}</ArrowLink>
            <p className="copy-row">
              <span>{email}</span>
              <button type="button" className="copy" onClick={copy}>
                <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
