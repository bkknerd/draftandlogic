// Studio arrow, drawn like a dimension line on a drawing: a tail tick, a shaft that
// stretches on hover, and an open head. Built from CSS + SVG so no phone turns it into emoji.
export function DimArrow({ out = false }) {
  return (
    <span className={`arw ${out ? 'arw-out' : ''}`} aria-hidden="true">
      <i />
      <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M1.5 1.5L6.5 6l-5 4.5" />
      </svg>
    </span>
  );
}

/** Text link with the studio arrow. variant: 'lg' (lime marker), 'sm', 'ink' (for the lime section). */
export function ArrowLink({ href, children, variant = '', out = false, className = '', ...rest }) {
  const ext = /^https?:/.test(href);
  return (
    <a
      href={href}
      className={`alink ${variant ? `alink-${variant}` : ''} ${className}`}
      {...(ext ? { target: '_blank', rel: 'noopener' } : {})}
      {...rest}
    >
      <span className="t">{children}</span>
      <DimArrow out={out} />
      {ext && <span className="sr"> (opens in a new tab)</span>}
    </a>
  );
}

export function Handle() {
  return (
    <svg width="22" height="12" viewBox="0 0 22 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 1L1 6l5 5M16 1l5 5-5 5" />
    </svg>
  );
}
