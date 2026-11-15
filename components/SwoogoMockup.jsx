// Concept conference site for the Swoogo page. Northfield Forum is fictional; the caption says so.
const lift = { position: 'relative', zIndex: 1 };

const agenda = [
  ['09:00', 'Opening keynote', 'Main stage', 'Plenary'],
  ['10:30', 'Pricing in a slow market', 'Room 204', 'Strategy'],
  ['11:45', 'Shipping with smaller teams', 'Room 210', 'Product'],
  ['13:30', 'Vendor contracts, rewritten', 'Room 118', 'Ops'],
];

const speakers = [
  ['AR', 'A. Rivera', 'COO'],
  ['JK', 'J. Kim', 'VP Product'],
  ['MO', 'M. Osei', 'CFO'],
  ['LP', 'L. Park', 'Founder'],
  ['DS', 'D. Shah', 'Head of Ops'],
  ['EB', 'E. Brandt', 'Director'],
];

const Logo = () => <span className="ev-logo">Northfield<em>/</em>Forum</span>;

export default function SwoogoMockup() {
  return (
    <div
      className="demo-grid"
      role="img"
      aria-label="Concept design of a corporate conference website on desktop and mobile, showing event branding, a registration button, a filterable agenda, speaker profiles and a sponsor row."
    >
      <div className="br" aria-hidden="true">
        <div className="br-bar"><i /><i /><i /><span className="br-url">events.northfieldforum.example/2027</span></div>
        <div className="ev">
          <div className="ev-nav">
            <Logo />
            <span className="ev-links"><span>Agenda</span><span>Speakers</span><span>Sponsors</span><span>Travel</span></span>
            <span className="ev-reg">Register</span>
          </div>
          <div className="ev-hero">
            <div style={lift}>
              <p className="ev-k">Annual Leadership Conference</p>
              <p className="ev-h">Build what<br />comes next.</p>
              <p className="ev-meta">April 14–16, 2027 · Convention Center, Hall C</p>
              <p className="ev-btns"><span>Register now</span><span>View agenda</span></p>
            </div>
            <div className="ev-count">
              <div><b>3</b><small>Days</small></div>
              <div><b>48</b><small>Sessions</small></div>
              <div><b>6</b><small>Tracks</small></div>
            </div>
          </div>
          <div className="ev-body">
            <div>
              <p className="ev-sh">Agenda <small>Day 1 · Apr 14</small></p>
              <p className="ev-tabs"><span className="on">All tracks</span><span>Strategy</span><span>Product</span><span>Ops</span></p>
              <ol className="ev-ag">
                {agenda.map(([t, title, room, track]) => (
                  <li key={t}><time>{t}</time><span><b>{title}</b><small>{room}</small></span><span className="tr">{track}</span></li>
                ))}
              </ol>
            </div>
            <div>
              <p className="ev-sh">Speakers <small>See all 32</small></p>
              <div className="ev-sp">
                {speakers.map(([i, name, role]) => (
                  <div key={i}><span className="ev-av">{i}</span><b>{name}</b><small>{role}</small></div>
                ))}
              </div>
            </div>
          </div>
          <div className="ev-spon"><small>Sponsors</small><span>Halcyon</span><span>Corvid Labs</span><span>Tessellate</span><span>Brightline</span><span>Oakum</span></div>
        </div>
      </div>
      <div className="ph" aria-hidden="true">
        <div className="ph-in ev">
          <div className="ev-nav"><Logo /><span>Menu</span></div>
          <div className="ev-hero"><div style={lift}><p className="ev-k">April 14–16, 2027</p><p className="ev-h">Build what comes next.</p></div></div>
          <div className="ev-body">
            <div>
              <p className="ev-sh">Up next <small>Day 1</small></p>
              <ol className="ev-ag">
                {agenda.slice(0, 3).map(([t, title, room]) => (
                  <li key={t}><time>{t}</time><span><b>{title}</b><small>{room}</small></span><span /></li>
                ))}
              </ol>
            </div>
          </div>
          <p className="ph-reg">Register now</p>
        </div>
      </div>
    </div>
  );
}
