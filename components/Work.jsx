import Link from 'next/link';
import Reveal from './Reveal';
import Drafted from './Drafted';
import BeforeAfter from './BeforeAfter';
import { ArrowLink, DimArrow } from './Icons';

const caseHref = (c) => (c.slug ? `/work/${c.slug}/` : '/work/');

/** One project: its screen, then the name and one short line. Nothing else. */
function Card({ c, className = '', big = false }) {
  const s = c.shots[0];
  return (
    <Reveal className={`wk-card ${className}`}>
      <Link href={caseHref(c)}>
        <span className="wk-img">
          {s ? <Drafted src={big ? s.src : s.thumb} draft={s.draft} alt={s.alt} /> : <span className="wcard-ph" />}
        </span>
        <span className="wk-cap">
          <span className="wk-name">{c.label}</span>
          {c.meta && <span className="wk-meta">{c.meta}</span>}
        </span>
      </Link>
    </Reveal>
  );
}

export default function Work({ work, cases, viewCase = 'Case study' }) {
  const [lead, ...rest] = cases;
  const big = rest[0];
  const side = rest.slice(1, 3);
  const extra = rest.slice(3);
  const ba = lead && lead.compare;
  const count = String(cases.length + ((work.alsoShow && work.also) || []).length).padStart(2, '0');

  return (
    <section id="work" className="work" aria-labelledby="work-h">
      <div className="wrap">
        <Reveal className="wk-head">
          <h2 id="work-h" className="mask"><span>{work.heading}</span></h2>
          <div className="wk-head-r">
            <span>{count} sites</span>
            {work.allLink && <ArrowLink href="/work/">{work.allLink}</ArrowLink>}
          </div>
        </Reveal>

        {lead && (
          <Reveal className="wk-feat">
            {ba ? (
              <BeforeAfter
                before={ba.beforeImage}
                after={ba.afterImage}
                beforeAlt={ba.beforeAlt}
                afterAlt={ba.afterAlt}
                label={`${lead.label}: drag to compare the old site and the redesign`}
              />
            ) : (
              <Link href={caseHref(lead)} className="wk-img" tabIndex={-1} aria-hidden="true">
                {lead.shots[0] && <Drafted src={lead.shots[0].src} draft={lead.shots[0].draft} alt="" />}
              </Link>
            )}
            <div className="wk-cap">
              <Link href={caseHref(lead)} className="wk-name wk-name-lg">{lead.label}<DimArrow /></Link>
              {lead.meta && <span className="wk-meta">{lead.meta}</span>}
            </div>
          </Reveal>
        )}

        {big && (
          <div className="wk-duo">
            <Card c={big} className="wk-big" big />
            {side.length > 0 && (
              <div className="wk-side">
                {side.map((c) => <Card key={c.label} c={c} />)}
              </div>
            )}
          </div>
        )}

        {extra.length > 0 && (
          <div className="wk-more">
            {extra.map((c) => <Card key={c.label} c={c} />)}
          </div>
        )}

        {work.alsoShow && (work.also || []).length > 0 && (
          <div className="also">
            <h3>{work.alsoHeading}</h3>
            <ul>
              {work.also.map((a) => (
                <li key={a.label}>
                  <a href={a.url} target="_blank" rel="noopener">
                    <span className="also-l">{a.label}</span>
                    <DimArrow />
                    <span className="sr"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
