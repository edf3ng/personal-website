import { site, absoluteUrl } from "@/lib/site";

function Script({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is build-time constant, never visitor input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function PersonJsonLd() {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "Person",
        name: site.name,
        url: site.url,
        email: `mailto:${site.email}`,
        description: site.description,
        sameAs: Object.values(site.links),
      }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  date,
  path,
  tags,
}: {
  title: string;
  description: string;
  date: string;
  path: string;
  tags?: string[];
}) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description,
        datePublished: date,
        dateModified: date,
        keywords: tags?.join(", "),
        url: absoluteUrl(path),
        mainEntityOfPage: absoluteUrl(path),
        author: { "@type": "Person", name: site.name, url: site.url },
      }}
    />
  );
}
