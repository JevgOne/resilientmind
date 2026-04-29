import { Helmet } from "react-helmet-async";

const BASE_URL = "https://resilientmind.io";
const DEFAULT_OG_IMAGE = "/assets/resilient-mind-logo.png";
const SITE_NAME = "Resilient Mind";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  ogType?: string;
  ogImage?: string;
  ogImageAlt?: string;
  keywords?: string;
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SEO = ({
  title,
  description,
  path = "",
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt = "Resilient Mind",
  keywords,
  noindex = false,
  publishedTime,
  modifiedTime,
  author,
  jsonLd,
}: SEOProps) => {
  const canonicalUrl = `${BASE_URL}${path}`;
  const absoluteOgImage = ogImage.startsWith("http")
    ? ogImage
    : `${BASE_URL}${ogImage}`;

  const robotsContent = noindex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1";

  const jsonLdArray = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={absoluteOgImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {author && <meta property="article:author" content={author} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteOgImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />

      {/* JSON-LD — each schema as its own script for clarity */}
      {jsonLdArray.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
