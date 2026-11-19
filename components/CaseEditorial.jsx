import Link from 'next/link';
import Reveal from './Reveal';
import { DimArrow } from './Icons';

/**
 * Editorial case study: full-bleed screen, client and tagline side by side, numbers,
 * one large statement, label-left lists, big screens, oversized section titles,
 * related work. Switched on per study with "layout": "editorial".
 */
export default function CaseEditorial({ st, i, services, related }) {
  const hero = st.card?.shots[0];
  const feats = st.features || [];
  const full = feats.find((f) => f.shape === 'full' && f.image);
  const phone = feats.find((f) => f.shape === 'phone' && f.image);
  const key = feats.filter((f) => f.image && !f.video && f.shape === 'wide' && f.text && !(hero && f.image === hero.web));
  const solo = key.length >= 4 ? key.slice(0, key.length - 2) : key;
  const pair = key.length >= 4 ? key.slice(-2) : [];

  return (
    <>
      {hero && (
        <div className="ed-hero">
          <img src={hero.web} alt={hero.alt} width="1440" height="900" fetchPriority="high" />
        </div>
      )}

      <div className="ed">
        <header className="ed-title">
          <h1 id="hero-h" className="ed-h1">{st.client}</h1>
          <div>
            <p className="ed-tagline">{st.headline}</p>
            {services.length > 0 && (
              <ul className="ed-tags" aria-label={i.csDid || 'What we did'}>
                {services.map((s) => <li key={s}>{s}</li>)}
              </ul>
            )}
            {st.url && <a className="ed-visit" href={st.url} target="_blank" rel="noopener">{i.csVisit || 'Visit site'}<span className="sr"> (opens in a new tab)</span></a>}
          </div>
        </header>

        {st.numbers.length > 0 && (
          <section className="ed-row ed-nums" aria-labelledby="ed-n">
            <h2 id="ed-n" className="ed-label">{st.numbersHeading || i.csNumbers || 'By the numbers'}</h2>
            <div>
              <dl>
                {st.numbers.map((n) => (
                  <div key={n.label}>
                    <dt>{n.label}</dt>
                    <dd>
                      {n.value}
                      {n.before && <small><span className="sr">{i.csBefore || 'Before'}: </span>was <s>{n.before}</s></small>}
                    </dd>
                  </div>
                ))}
              </dl>
              {st.numbersNote && <p className="ed-note">{st.numbersNote}</p>}
            </div>
          </section>
        )}

        {st.statement && (
          <Reveal as="section" className="ed-statement" aria-label="Overview">
            <p>{st.statement}</p>
          </Reveal>
        )}

        {services.length > 0 && (
          <section className="ed-row ed-list" aria-labelledby="ed-did">
            <h2 id="ed-did" className="ed-label">{i.csDid || 'What we did'}</h2>
            <ul>{services.map((s) => <li key={s}>{s}</li>)}</ul>
          </section>
        )}
        {st.platforms.length > 0 && (
          <section className="ed-row ed-list" aria-labelledby="ed-built">
            <h2 id="ed-built" className="ed-label">{i.csBuilt || 'Built with'}</h2>
            <ul>{st.platforms.map((s) => <li key={s}>{s}</li>)}</ul>
          </section>
        )}

        {(full || phone) && (
          <Reveal as="section" className={`ed-show${full && phone ? '' : ' one'}`} aria-label="The finished site">
            {full && (
              <figure>
                <div className="ed-scroll" tabIndex={0} role="group" aria-label={`${full.title}, scrolls`}>
                  <img src={full.image} alt={full.alt || ''} loading="lazy" width={full.w} height={full.h} />
                </div>
                <figcaption>{full.title}</figcaption>
              </figure>
            )}
            {phone && (
              <figure className="ed-phone">
                <img src={phone.image} alt={phone.alt || ''} loading="lazy" width={phone.w} height={phone.h} />
                <figcaption>{phone.title}</figcaption>
              </figure>
            )}
          </Reveal>
        )}

        {(st.brief || st.closing) && (
          <section className="ed-narr" aria-label="The brief">
            {st.brief && <p className="ed-brief">{st.brief}</p>}
            {st.closing && <Reveal as="p" className="ed-closing">{st.closing}</Reveal>}
          </section>
        )}

        {st.compare.length > 0 && (
          <section className="ed-sec" aria-labelledby="ed-ba">
            <h2 id="ed-ba" className="ed-giant">{i.csCompare || 'Before and after'}</h2>
            {st.compare.map((c) => (
              <div key={c.title} className="ed-ba">
                <div className="ed-row ed-ba-head">
                  <h3 className="ed-label">{c.title}</h3>
                  <div className="ed-ba-notes">
                    <p><b>{i.csBefore || 'Before'}</b>{c.beforeNote}</p>
                    <p><b>{i.csAfter || 'After'}</b>{c.afterNote}</p>
                  </div>
                </div>
                {[
                  ['was', i.csBefore || 'Before', c.before, c.beforeMobile, c.beforeAlt],
                  ['now', i.csAfter || 'After', c.after, c.afterMobile, c.afterAlt],
                ].map(([k, label, desk, ph, alt]) => (
                  <Reveal as="figure" key={k} className={`ed-ba-set ed-${k}${ph ? '' : ' one'}`}>
                    <span className="ed-tag-img">{label}</span>
                    <img src={desk} alt={alt ? `${label}: ${alt}, desktop` : ''} loading="lazy" width="1262" height="788" />
                    {ph && <img className="ed-ba-ph" src={ph} alt={alt ? `${label}: ${alt}, phone` : ''} loading="lazy" width="656" height="1419" />}
                  </Reveal>
                ))}
              </div>
            ))}
          </section>
        )}

        {key.length > 0 && (
          <section className="ed-sec" aria-labelledby="ed-kf">
            <h2 id="ed-kf" className="ed-giant">{i.csKeyFeatures || 'Key features'}</h2>
            {solo.map((f) => (
              <article key={f.title} className="ed-feat">
                <div className="ed-row">
                  <h3 className="ed-label">{f.title}</h3>
                  <div className="ed-feat-txt">
                    <p>{f.text}</p>
                    {f.story && <p className="ed-mut">{f.story}</p>}
                  </div>
                </div>
                <Reveal as="figure" className="ed-img">
                  <img src={f.image} alt={f.alt || ''} loading="lazy" width={f.w} height={f.h} />
                </Reveal>
              </article>
            ))}
            {pair.length > 0 && (
              <div className="ed-two">
                {pair.map((f) => (
                  <Reveal as="article" key={f.title} className="ed-feat">
                    <figure className="ed-img"><img src={f.image} alt={f.alt || ''} loading="lazy" width={f.w} height={f.h} /></figure>
                    <h3 className="ed-label">{f.title}</h3>
                    <p>{f.text}</p>
                  </Reveal>
                ))}
              </div>
            )}
          </section>
        )}

        {st.cms && (
          <section className="ed-sec ed-cms" aria-labelledby="ed-cms">
            <h2 id="ed-cms" className="ed-giant">{st.cms.title}</h2>
            <div className="ed-row">
              <p className="ed-label">{st.cms.label || 'The back end'}</p>
              <div>
                {st.cms.intro && <p className="ed-cms-intro">{st.cms.intro}</p>}
                {st.cms.items.length > 0 && <ul className="ed-cms-list">{st.cms.items.map((x) => <li key={x}>{x}</li>)}</ul>}
              </div>
            </div>
            {(() => {
              const sh = st.cms.shots;
              const rows = [];
              for (let k = 0; k < sh.length; ) {
                if (sh[k].half && sh[k + 1] && sh[k + 1].half) { rows.push([sh[k], sh[k + 1]]); k += 2; } else { rows.push([sh[k]]); k += 1; }
              }
              return rows.map((r) => (
                <div key={r[0].image} className={r.length === 2 ? 'ed-two ed-cms-two' : 'ed-cms-one'}>
                  {r.map((x) => (
                    <Reveal as="figure" key={x.image} className="ed-img">
                      <img src={x.image} alt={x.alt || ''} loading="lazy" width="1440" height="900" />
                      {x.caption && <figcaption>{x.caption}</figcaption>}
                    </Reveal>
                  ))}
                </div>
              ));
            })()}
          </section>
        )}

        {st.impact.length > 0 && (
          <section className="ed-row ed-imp" aria-labelledby="ed-i">
            <div>
              <h2 id="ed-i" className="ed-label">{i.csImpact || 'What it should move'}</h2>
              {st.impactNote && <p className="ed-note">{st.impactNote}</p>}
            </div>
            <ul>
              {st.impact.map((n) => (
                <li key={n.value + n.text.slice(0, 12)}>
                  <strong>{n.value}</strong>
                  <div>
                    <p>{n.text}</p>
                    {n.source && (n.url ? <a href={n.url} target="_blank" rel="noopener">{n.source}<span className="sr"> (opens in a new tab)</span></a> : <span className="ed-mut">{n.source}</span>)}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {st.quote && (
          <section className="ed-row ed-quote" aria-label="Client quote">
            <p className="ed-label">{st.quote.name}{st.quote.role ? `, ${st.quote.role}` : ''}</p>
            <blockquote><p>{st.quote.text}</p></blockquote>
          </section>
        )}

        {related.length > 0 && (
          <section className="ed-sec ed-rel" aria-labelledby="ed-rw">
            <h2 id="ed-rw" className="ed-giant">{i.csRelated || 'Related work'}</h2>
            <ul>
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/work/${r.slug}/`}>
                    {r.shot && <span className="ed-rel-img"><img src={r.shot.web} alt="" loading="lazy" width="1280" height="800" /></span>}
                    <span className="ed-rel-cap">
                      <strong>{r.label}</strong>
                      <span>{r.title}</span>
                      <em>{i.csViewCase || 'View case'} <DimArrow /></em>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
