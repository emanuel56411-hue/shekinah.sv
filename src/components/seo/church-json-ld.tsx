import { LINKS } from "@/lib/constants";
import { absoluteUrl, SITE_DESCRIPTION, SITE_LOCALITY, SITE_NAME, SITE_URL } from "@/lib/site";

export function ChurchJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Church",
    "@id": `${SITE_URL}#church`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    image: absoluteUrl("/assets/fotos/congregacion-culto-opt.webp"),
    telephone: "+503 7873-7213",
    address: {
      "@type": "PostalAddress",
      streetAddress: "San Juan Opico",
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
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "https://schema.org/Tuesday",
        opens: "19:00",
        closes: "20:30",
        description: "Estudio exegético",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "https://schema.org/Thursday",
        opens: "19:00",
        closes: "20:30",
        description: "Estudio bíblico",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "https://schema.org/Saturday",
        opens: "16:30",
        closes: "18:00",
        description: "Culto de jóvenes",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "https://schema.org/Sunday",
        opens: "08:30",
        closes: "09:40",
        description: "Primer culto devocional",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "https://schema.org/Sunday",
        opens: "10:00",
        closes: "11:30",
        description: "Segundo culto devocional",
      },
    ],
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
