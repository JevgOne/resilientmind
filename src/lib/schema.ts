/**
 * Schema.org JSON-LD helpers for Resilient Mind.
 * Returns plain objects ready to drop into the SEO component's `jsonLd` prop.
 */

const BASE_URL = "https://resilientmind.io";
const ORG_ID = `${BASE_URL}/#organization`;
const PERSON_ID = `${BASE_URL}/#silvie`;

type Json = Record<string, unknown>;

export const breadcrumb = (
  items: Array<{ name: string; path: string }>,
): Json => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: `${BASE_URL}${item.path}`,
  })),
});

export const faqPage = (
  faqs: Array<{ q: string; a: string }>,
): Json => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
});

export const product = (opts: {
  name: string;
  description: string;
  url: string;
  image?: string;
  offers: Array<{ name: string; price: string; currency?: string; url?: string }>;
}): Json => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: opts.name,
  description: opts.description,
  brand: { "@id": ORG_ID },
  image: opts.image || `${BASE_URL}/assets/resilient-mind-logo.png`,
  url: opts.url,
  offers: opts.offers.map((o) => ({
    "@type": "Offer",
    name: o.name,
    price: o.price,
    priceCurrency: o.currency || "EUR",
    availability: "https://schema.org/InStock",
    url: o.url || opts.url,
    seller: { "@id": ORG_ID },
  })),
});

export const service = (opts: {
  name: string;
  description: string;
  url: string;
  serviceType?: string;
}): Json => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: opts.name,
  description: opts.description,
  url: opts.url,
  serviceType: opts.serviceType || "Online membership program",
  provider: { "@id": ORG_ID },
  areaServed: "Worldwide",
  audience: {
    "@type": "Audience",
    audienceType: "Expat women",
  },
});

export const course = (opts: {
  name: string;
  description: string;
  url: string;
}): Json => ({
  "@context": "https://schema.org",
  "@type": "Course",
  name: opts.name,
  description: opts.description,
  url: opts.url,
  provider: {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Resilient Mind",
  },
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "Online",
    inLanguage: "en",
    courseWorkload: "PT15M",
  },
  educationalLevel: "Beginner to intermediate",
  inLanguage: "en",
});

export const article = (opts: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}): Json => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: opts.title,
  description: opts.description,
  image: opts.image,
  url: opts.url,
  datePublished: opts.datePublished,
  dateModified: opts.dateModified || opts.datePublished,
  author: opts.author
    ? { "@type": "Person", name: opts.author }
    : { "@id": PERSON_ID },
  publisher: { "@id": ORG_ID },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": opts.url,
  },
});

export const aboutPage = (): Json => ({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: `${BASE_URL}/about`,
  mainEntity: { "@id": PERSON_ID },
});

export const contactPage = (path: string): Json => ({
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: `${BASE_URL}${path}`,
  about: { "@id": ORG_ID },
});
