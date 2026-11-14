// The Draft and Logic wordmark: construction lines plus the letterforms.
// `draw` animates each stroke in, the way the logo is drawn on the live site.
export default function Wordmark({ draw = false, className = '' }) {
  return (
    <svg className={`wm ${draw ? 'wm-draw' : ''} ${className}`} viewBox="0 0 292 46" aria-hidden="true" focusable="false">
      <g className="cl">
        <path pathLength="1" d="M0 8H292M0 36H292M0 3V13M292 3V13M0 31V41M292 31V41" />
        <path className="mid" d="M0 22H292" />
      </g>
      <g className="ink">
        <path style={{ '--i': 0 }} pathLength="1" d="M6 8V36M6 8H13A14 14 0 0 1 13 36H6" />
        <path style={{ '--i': 1 }} pathLength="1" d="M34 36V8H42A7 7 0 0 1 42 22H34M42 22L50 36" />
        <path style={{ '--i': 2 }} pathLength="1" d="M57 36L66 8L75 36M59.6 28H72.4" />
        <path style={{ '--i': 3 }} pathLength="1" d="M82 36V8H96M82 22H93" />
        <path style={{ '--i': 4 }} pathLength="1" d="M103 8H119M111 8V36" />
        <path style={{ '--i': 5 }} pathLength="1" transform="translate(134 8)" d="M20 28L4 9A5.5 5.5 0 0 1 15 9C15 14 7 17 3 21C0 26 5 28.5 9 28.5C14 28.5 18 24 19 19" />
        <path style={{ '--i': 6 }} pathLength="1" d="M171 8V36H185" />
        <ellipse style={{ '--i': 7 }} pathLength="1" cx="204" cy="22" rx="12" ry="14" />
        <path style={{ '--i': 8 }} pathLength="1" d="M244.2 13A12 14 0 1 0 247 22H236" />
        <path style={{ '--i': 9 }} pathLength="1" d="M254 8V36" />
        <path style={{ '--i': 10 }} pathLength="1" d="M282.2 13A12 14 0 1 0 282.2 31" />
      </g>
      <circle className="nd" cx="204" cy="22" r="2.4" />
    </svg>
  );
}
