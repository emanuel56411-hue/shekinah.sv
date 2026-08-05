import { LINKS } from "@/lib/constants";
import { absoluteUrl, SITE_DESCRIPTION, SITE_LOCALITY, SITE_NAME, SITE_URL } from "@/lib/site";

export function ChurchJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    image: absoluteUrl("/assets/fotos/congregacion-culto-opt.webp"),
    telephone: "+50378737213",
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Juan Opico",
      addressRegion: "La Libertad",
      addressCountry: "SV",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 13.7915625,
      longitude: -89.3586875,
    },
    areaServed: SITE_LOCALITY,
    sameAs: [LINKS.facebook, LINKS.instagram, LINKS.youtube],
    hasMap: LINKS.maps,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
