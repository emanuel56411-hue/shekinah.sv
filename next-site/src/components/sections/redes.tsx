"use client";

import { ExternalLink } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { LINKS } from "@/lib/constants";

const socialLinks = [
  {
    key: "instagram",
    href: LINKS.instagram,
    label: "Instagram",
    handle: "@shekinahelsalvador",
    className: "hover:border-pink-300 hover:bg-pink-50 dark:hover:bg-pink-950/20",
  },
  {
    key: "facebook",
    href: LINKS.facebook,
    label: "Facebook",
    handle: "Shekinah Versalles",
    className: "hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/20",
  },
  {
    key: "youtube",
    href: LINKS.youtube,
    label: "YouTube",
    handle: "@Iglesia_ShekinahVersalles",
    className: "hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-950/20",
  },
];

export function Redes() {
  const { t } = useLanguage();

  return (
    <section id="redes" className="section-padding bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="eyebrow">{t("nav.redes")}</p>
          <h2 className="section-title">{t("redes.title")}</h2>
          <p className="section-desc">{t("redes.description")}</p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {socialLinks.map((social, index) => (
            <Reveal key={social.key} delay={index * 0.06}>
              <a href={social.href} target="_blank" rel="noopener noreferrer" className="block h-full">
                <Card
                  className={`h-full shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover ${social.className}`}
                >
                  <CardContent className="flex h-full flex-col justify-between p-6">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{social.label}</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <strong className="mt-4 text-lg text-shekinah">{social.handle}</strong>
                  </CardContent>
                </Card>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
