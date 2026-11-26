import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import Faq from '@/components/Faq';
import Reveal from '@/components/Reveal';
import SwoogoMockup from '@/components/SwoogoMockup';
import SwoogoTrack from '@/components/SwoogoTrack';
import { ArrowLink } from '@/components/Icons';
import { getSite, getAreas, SITE_URL } from '@/lib/content';
import { ldJson, orgId } from '@/lib/schema';

const PATH = '/swoogo-development/';
const URL_ = SITE_URL + PATH;
const TITLE = 'Swoogo Development & Custom Event Websites | Draft & Logic';
const DESCRIPTION = 'Custom Swoogo event website design, development, integrations, and technical support. Extend your event platform with tailored digital experiences.';
const SHARE = 'Custom event websites, Swoogo development, integrations, and technical support for organizations and event agencies.';
const UPDATED = '2026-11-15';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: 'website',
    url: URL_,
    siteName: 'Draft & Logic',
    title: TITLE,
    description: SHARE,
    images: [{ url: '/og-swoogo.png', width: 1200, height: 630, alt: 'Concept conference website designed and built by Draft & Logic' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: SHARE, images: ['/og-swoogo.png'] },
};

const services = [
  {
    id: 'websites',
    h: 'Custom Swoogo Event Websites',
    lead: ['Branded Swoogo event websites that look like your organization and make it easy for attendees to find what they need and register.'],
    items: ['Custom event page layouts', 'Branded landing pages and microsites', 'Responsive desktop and mobile experiences', 'Navigation and content architecture', 'Conversion-focused registration journeys'],
  },
  {
    id: 'widgets',
    h: 'Custom Swoogo Widgets & Functionality',
    lead: [
      "Features built around your audience that Swoogo doesn’t offer out of the box.",
      "Some run inside Swoogo pages as custom code. Others work better as separately hosted components that pull data from your event. You’ll know which is which before anything is built.",
    ],
    items: ['Custom speaker and presenter directories', 'Interactive agendas and session listings', 'Sponsor and exhibitor showcases', 'Searchable event content', 'Custom content components', 'Interactive event features'],
  },
];

const support = {
  id: 'support',
  h: 'Ongoing Swoogo Development & Technical Support',
  lead: ['Event requirements change. Your website and the technology behind it should keep up.', 'We provide ongoing Swoogo technical support and development for teams that need more capacity, event to event or across a full season.'],
  items: ['Improvements to existing event websites', 'Reusable templates and components', 'Technical troubleshooting', 'Event-specific development', 'Website maintenance', 'Performance and usability improvements'],
};

const ways = [
  ['Native Swoogo configuration', 'Registration forms, page structure, themes, emails and anything Swoogo already does well.', 'Your plan and the features enabled on your account.'],
  ['Custom HTML, CSS and JavaScript in Swoogo', 'Brand-accurate layouts, styling, interactive page elements and small enhancements.', 'Where your account allows custom code, and how Swoogo renders those pages.'],
  ['Externally hosted components', 'Searchable directories, advanced agendas and microsites that need more than a page builder allows.', 'Hosting, embedding rules and keeping event data in sync.'],
  ['API-connected applications and integrations', 'Moving registration data into a CRM, marketing platform or reporting tool, and back.', "API credentials from your Swoogo admin, and the third-party platform’s own API and limits."],
];

const audiences = [
  ['Event marketing teams', 'Branded experiences that support promotion, registration and attendee engagement.'],
  ['Associations & membership organizations', 'Event sites for conferences, annual meetings, member programs and recurring events.'],
  ['Corporate event teams', 'Digital experiences for corporate conferences, customer events, internal meetings and industry programs.'],
];

const needs = [
  ['Swoogo access', 'A user login with website editing rights for the events in scope.'],
  ['API credentials', 'Only for integrations. Your Swoogo admin generates them under My Profile, then API Credentials.'],
  ['Brand files', 'Logo, colors, fonts and any photography you have the rights to use.'],
  ['Systems to connect', 'The CRM, marketing platform or reporting tool, with an admin contact for each.'],
  ['Key dates', 'Event dates and the day registration needs to open.'],
];

const faq = {
  heading: 'Frequently asked questions',
  items: [
    { q: 'What is Swoogo?', a: 'Swoogo is an event management platform for registration, attendee management, sessions and event communications, used for in-person, virtual and hybrid events.' },
    { q: 'Can you build custom websites using Swoogo?', a: 'Yes. We design and build custom Swoogo event websites using its own customization options first, then add front-end development where the event needs more.' },
    { q: 'Can you customize an existing Swoogo event website?', a: 'Yes. We review the current site, list what to change in design, navigation, mobile layout and functionality, then make those changes.' },
    { q: 'Can Swoogo connect to other platforms?', a: "Yes. Swoogo has a documented REST API covering events, registrants, sessions, speakers and contacts, authenticated with OAuth2 client credentials." },
    { q: 'Can you create custom event registration experiences?', a: "We can redesign the pages and journey around registration. The registration form and logic stay in Swoogo, so what’s possible depends on your plan and configuration." },
    { q: 'Do you work with event agencies?', a: "Yes. We provide white-label Swoogo development for event agencies and production companies, delivered under the agency’s name." },
    { q: 'Can you work on a single event?', a: 'Yes. We take on one-off event builds as well as ongoing support across a full event season.' },
    { q: 'Do we need to migrate away from Swoogo?', a: 'No. We extend and improve the Swoogo setup you already have rather than replace it.' },
  ],
};

function ServiceRow({ s }) {
  return (
    <Reveal as="article" className="svc-row" id={s.id}>
      <div>
        <h2>{s.h}</h2>
        {s.lead.map((p) => <p key={p} className="lead">{p}</p>)}
      </div>
      <div>
        <ul className="cs-list">{s.items.map((i) => <li key={i}>{i}</li>)}</ul>
      </div>
    </Reveal>
  );
}

export default function SwoogoDevelopment() {
  const s = getSite();
  const email = s.footer.email;
  const mail = (subject) => `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  const founder = s.footer.founderName || 'Mike Browne';

  const graph = [
    {
      '@type': 'WebPage',
      '@id': URL_ + '#webpage',
      url: URL_,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: 'en-US',
      datePublished: UPDATED,
      dateModified: UPDATED,
      isPartOf: { '@id': SITE_URL + '/#website' },
      publisher: { '@id': orgId },
      author: { '@type': 'Person', name: founder, jobTitle: s.footer.founderTitle || 'Founder', worksFor: { '@id': orgId } },
      about: { '@id': URL_ + '#service' },
      breadcrumb: { '@id': URL_ + '#breadcrumb' },
    },
    {
      '@type': 'Service',
      '@id': URL_ + '#service',
      name: 'Swoogo Development',
      serviceType: 'Swoogo development and custom event website development',
      description: 'Custom Swoogo event website design and front-end development, custom widgets, Swoogo REST API and third-party integrations, ongoing technical support, and white-label development for event agencies.',
      url: URL_,
      provider: { '@id': orgId },
      subjectOf: { '@type': 'CreativeWork', name: 'NAMC 2027 National Conference website', url: SITE_URL + '/work/namc/', creator: { '@id': orgId } },
      areaServed: { '@type': 'Country', name: 'United States' },
      audience: { '@type': 'BusinessAudience', audienceType: 'Event marketing teams, associations, corporate event teams, event agencies and production companies' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Swoogo development services',
        itemListElement: ['Custom Swoogo event websites', 'Custom Swoogo widgets and functionality', 'Swoogo API and third-party integrations', 'Ongoing Swoogo development and technical support', 'White-label Swoogo development for event agencies'].map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': URL_ + '#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
        { '@type': 'ListItem', position: 2, name: 'Swoogo Development', item: URL_ },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': URL_ + '#faq',
      mainEntity: faq.items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(graph) }} />
      <SwoogoTrack />
      <Nav items={s.nav.items} home={false} />
      <main id="main" className="page sw">
        {/* Hero */}
        <header className="wrap page-head" id="top">
          <h1 className="sw-h1">Swoogo Development <span>&amp; Custom Event Websites</span></h1>
          <div className="sw-row">
            <p className="tag">Make more of your event platform.</p>
            <div className="hero-copy">
              <p>Swoogo runs registration, attendees, sessions and event email. Draft &amp; Logic builds what sits around it: the event website, the features Swoogo doesn’t ship with, and the connections to your CRM and marketing tools.</p>
              <p className="m">You keep the platform. We make it look like your brand, work on every device and talk to the rest of your stack.</p>
              <div className="hcta">
                <ArrowLink href={mail('Swoogo project')} variant="lg" data-ga="swoogo_cta_click" data-ga-loc="hero">Discuss your Swoogo project</ArrowLink>
                <ArrowLink href="#agencies">Agency partnerships</ArrowLink>
              </div>
              <p className="proof">Recent Swoogo work: <Link href="/work/namc/">NAMC 2027</Link>, the National Conference site for NAMC Wisconsin, with registration, sponsorship and exhibiting each one click from the home page.</p>
            </div>
          </div>
        </header>

        {/* Concept build */}
        <section className="wrap demo" aria-label="Concept event website">
          <figure className="demo-fig">
            <Reveal className="demo-stage"><SwoogoMockup /></Reveal>
            <figcaption className="demo-cap"><span><b>Concept build.</b></span></figcaption>
          </figure>
        </section>

        {/* Introduction */}
        <section className="sec sec-top0" aria-labelledby="intro-h">
          <div className="wrap intro">
            <Reveal><h2 id="intro-h" className="lede">Swoogo development beyond the standard template</h2></Reveal>
            <Reveal className="body">
              <p>The event website is usually the first thing an attendee sees. Swoogo’s templates cover the basics. When the brand, the audience or the program gets specific, a custom build usually serves the event better.</p>
              <p className="m">We start with what Swoogo can do natively and build outside it only where the event needs it, whether that’s a corporate conference, an association’s annual meeting, an industry summit or a season of recurring events.</p>
            </Reveal>
          </div>
        </section>

        {/* Services */}
        <section className="wrap" aria-label="Swoogo development services">
          <div className="svc">
            {services.map((x) => <ServiceRow key={x.id} s={x} />)}
            <Reveal as="article" className="svc-row" id="integrations">
              <div>
                <h2>Swoogo API &amp; <span className="nw">Third-Party</span> Integrations</h2>
                <p className="lead">Your event platform rarely works alone. We connect Swoogo to the systems you use for marketing, customer records, reporting and communications.</p>
                <ul className="facts">
                  <li><b>REST API.</b> Swoogo publishes a documented API covering events, registrants, sessions, speakers and contacts.</li>
                  <li><b>Authentication.</b> OAuth2 client credentials, issued by your Swoogo admin. Tokens expire every 30 minutes, so integrations renew them automatically.</li>
                </ul>
              </div>
              <div>
                <div className="flow">
                  <ul><li>CRM<small>Registrants to contacts and deals</small></li><li>Marketing platform<small>Lists, segments, follow-up</small></li></ul>
                  <span className="hub">Swoogo</span>
                  <ul><li>Reporting<small>Registration and attendance data</small></li><li>Event website<small>Live agenda and speaker data</small></li></ul>
                </div>
              </div>
            </Reveal>
            <ServiceRow s={support} />
          </div>
        </section>

        {/* How Swoogo is extended */}
        <section className="sec dark sec-gap" aria-labelledby="ext-h">
          <div className="wrap">
            <Reveal className="ext-head">
              <div><h2 id="ext-h" className="lede">Four ways to extend Swoogo</h2></div>
              <p>These aren’t interchangeable. Each one has different strengths, limits and upkeep, and most projects use more than one. We match each requirement to the right layer.</p>
            </Reveal>
            <ol className="ext">
              {ways.map(([h, best, dep]) => (
                <Reveal as="li" key={h}>
                  <h3>{h}</h3>
                  <div><span className="k">Best for</span><p>{best}</p></div>
                  <div><span className="k">Depends on</span><p>{dep}</p></div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Who we work with */}
        <section className="sec" aria-labelledby="who-h">
          <div className="wrap">
            <Reveal><h2 id="who-h" className="lede">Technical development for teams building better events</h2></Reveal>
            <div className="who who-3">
              {audiences.map(([h, p]) => <Reveal key={h}><h3>{h}</h3><p>{p}</p></Reveal>)}
            </div>
          </div>
        </section>

        {/* White-label */}
        <section id="agencies" className="sec wl" aria-labelledby="wl-h">
          <div className="wrap">
            <Reveal as="h2" id="wl-h" className="wl-h">Your event strategy. <span>Our development.</span></Reveal>
            <div className="wl-grid wl-solo">
              <Reveal className="wl-copy">
                <p>White-label Swoogo development for event agencies. You bring the creative direction, the client relationships and the production. Draft &amp; Logic adds development capacity behind the scenes, as an extension of your team.</p>
                <div className="wl-how">
                  <div><b>Your brand</b><span>Work delivered under your agency’s name.</span></div>
                  <div><b>Your client</b><span>You own the relationship and the scope.</span></div>
                  <div><b>Our build</b><span>Design, code and integrations on your timeline.</span></div>
                </div>
                <div className="hcta">
                  <ArrowLink href={mail('Agency partnership: Swoogo development')} variant="lg" data-ga="swoogo_agency_cta_click" data-ga-loc="agency_section">Discuss an Agency Partnership</ArrowLink>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* What we need to start */}
        <section id="start" className="sec sec-bot0" aria-labelledby="need-h">
          <div className="wrap need">
            <Reveal><h2 id="need-h" className="lede">What we need to start a Swoogo project</h2></Reveal>
            <Reveal as="ol">
              {needs.map(([b, t]) => <li key={b}><b>{b}</b><span>{t}</span></li>)}
            </Reveal>
          </div>
        </section>

        <Faq faq={faq} label="" />

        <Contact
          id="swoogo-contact"
          heading="Let’s build a better event experience."
          contact={{ intro: 'Send a short note on the event, the Swoogo setup you have and what you want it to do. We reply within two working days.', button: "Talk about your Swoogo project" }}
          email={email}
        />
      </main>
      <Footer footer={s.footer} areas={getAreas()} hideEmail home={false} />
    </>
  );
}
