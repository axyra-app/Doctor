'use client';

export function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doctorathome.app';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DoctorAtHome',
    description: 'Plataforma de atención médica a domicilio',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['Spanish'],
    },
    sameAs: [
      // Add social media links here
    ],
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: 'DoctorAtHome',
    description: 'Servicio de atención médica a domicilio',
    url: baseUrl,
    areaServed: {
      '@type': 'Country',
      name: 'México',
    },
    medicalSpecialty: [
      'General Medicine',
      'Pediatrics',
      'Cardiology',
      'Emergency Medicine',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DoctorAtHome',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}

