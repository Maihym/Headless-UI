// JSON-LD Schema generators for structured data

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://firstelectric.pro',
    name: 'First Electric',
    image: 'https://firstelectric.pro/Logo.svg',
    logo: 'https://firstelectric.pro/Logo.svg',
    url: 'https://firstelectric.pro',
    telephone: '(657) 239-6331',
    email: 'contact@firstelectric.pro',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'La Mirada',
      addressLocality: 'La Mirada',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 33.9172,
      longitude: -118.0120,
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'La Mirada',
      },
      {
        '@type': 'City',
        name: 'Whittier',
      },
      {
        '@type': 'City',
        name: 'Santa Fe Springs',
      },
      {
        '@type': 'City',
        name: 'Norwalk',
      },
      {
        '@type': 'City',
        name: 'Buena Park',
      },
      {
        '@type': 'City',
        name: 'Fullerton',
      },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
    slogan: 'First choice today, worry-free tomorrow.',
    description: 'Licensed La Mirada electricians for homes & businesses. EV chargers, panels, repairs. 24/7 emergency. Lifetime workmanship guarantee.',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '3',
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateServiceSchema(name: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: name,
    provider: {
      '@type': 'LocalBusiness',
      name: 'First Electric',
      telephone: '(657) 239-6331',
    },
    areaServed: {
      '@type': 'City',
      name: 'La Mirada',
    },
    description: description,
  };
}

