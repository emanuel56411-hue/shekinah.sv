"use client";

import { ExternalLink, Facebook, Instagram, Youtube, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const socialLinks: {
  key: string;
  href: string;
  label: string;
  handle: string;
  icon: LucideIcon;
  iconClass: string;
  className: string;
}[] = [
  {
    key: "instagram",
    href: LINKS.instagram,
    label: "Instagram",
    handle: "@shekinahelsalvador",
    icon: Instagram,
    iconClass: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white",
    className: "hover:border-pink-300 hover:bg-pink-50 dark:hover:bg-pink-950/20",
  },
  {
    key: "facebook",
    href: LINKS.facebook,
    label: "Facebook",
    handle: "Shekinah Versalles",
    icon: Facebook,
    iconClass: "bg-[#1877F2] text-white",
    className: "hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/20",
  },
  {
    key: "youtube",
    href: LINKS.youtube,
    label: "YouTube",
    handle: "@Iglesia_ShekinahVersalles",
    icon: Youtube,
    iconClass: "bg-[#FF0000] text-white",
    className: "hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-950/20",
  },
];

function BrandIcon({
  icon: Icon,
  className,
}: {
  icon: LucideIcon;
  className: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm",
        className
      )}
      aria-hidden
    >
      <Icon className="h-5 w-5" strokeWidth={2.25} />
    </span>
  );
}

export function Redes() {
  const { t } = useLanguage();

  return (
    <section id="redes" className="section-padding section-surface-alt">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="eyebrow">{t("nav.redes")}</p>
          <h2 className="section-title">{t("redes.title")}</h2>
          <p className="section-desc">{t("redes.description")}</p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {socialLinks.map((social, index) => (
            <Reveal key={social.key} delay={index * 0.06}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah focus-visible:ring-offset-2"
              >
                <Card
                  className={cn(
                    "h-full shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover",
                    social.className
                  )}
                >
                  <CardContent className="flex h-full flex-col justify-between gap-5 p-6">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{social.label}</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <BrandIcon icon={social.icon} className={social.iconClass} />
                      <strong className="text-center text-base text-shekinah sm:text-lg">{social.handle}</strong>
                      <BrandIcon icon={social.icon} className={social.iconClass} />
                    </div>
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
