import { getSite, SITE_URL } from './content';

export const orgId = SITE_URL + '/#org';

/** The studio as structured data. The Google Business Profile goes in sameAs only, never on the page. */
export function org() {
  const { seo, footer, services, on } = getSite();
  return {
    '@type': ['ProfessionalService', 'Organization'],
    '@id': orgId,
    name: 'Draft and Logic',
    url: SITE_URL + '/',
    description: seo.description,
    image: SITE_URL + '/og.png',
    logo: { '@type': 'ImageObject', url: SITE_URL + '/favicon-512.png', width: 512, height: 512 },
    address: { '@type': 'PostalAddress', addressLocality: 'Wake Forest', addressRegion: 'NC', addressCountry: 'US' },
    areaServed: ['Wake Forest', 'Cary', 'Raleigh'].map((name) => ({ '@type': 'City', name })),
    telephone: footer.phone || undefined,
    email: footer.email || undefined,
    hasMap: footer.gbpUrl || undefined,
    sameAs: [footer.gbpUrl, footer.github, footer.founderLinkedin].filter(Boolean),
    founder: footer.founderName
      ? { '@type': 'Person', name: footer.founderName, jobTitle: footer.founderTitle || undefined, sameAs: footer.founderLinkedin ? [footer.founderLinkedin] : undefined }
      : undefined,
    knowsAbout: seo.topics,
    hasOfferCatalog: on.services
      ? {
          '@type': 'OfferCatalog',
          name: 'Services',
          itemListElement: services.levels.map((l) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: l.title, description: [l.lead, l.text].filter(Boolean).join(' '), provider: { '@id': orgId } },
          })),
        }
      : undefined,
  };
}

export const ldJson = (graph) =>
  JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
