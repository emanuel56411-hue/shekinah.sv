"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { useLanguage } from "@/components/providers/language-provider";
import { LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type DirectionAction = {
  href: string;
  label: string;
  hint: string;
  iconSrc: string;
  iconAlt: string;
  iconWrapClass: string;
};

export function Ubicacion() {
  const { t } = useLanguage();

  const actions: DirectionAction[] = [
    {
      href: LINKS.maps,
      label: t("ubicacion.mapsBtn"),
      hint: t("ubicacion.mapsHint"),
      iconSrc: "/assets/icons/google-maps.png",
      iconAlt: "Google Maps",
      iconWrapClass: "bg-white",
    },
    {
      href: LINKS.waze,
      label: t("ubicacion.wazeBtn"),
      hint: t("ubicacion.wazeHint"),
      iconSrc: "/assets/icons/waze.png",
      iconAlt: "Waze",
      iconWrapClass: "bg-black",
    },
  ];

  return (
    <section id="ubicacion" className="section-padding section-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-start">
        <Reveal>
          <h2 className="section-title mt-0">{t("ubicacion.title")}</h2>
          <p className="section-desc">{t("ubicacion.description")}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {actions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className="surface-glass group flex items-center gap-3 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah"
              >
                <span
                  className={cn(
                    "relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-white/15",
                    action.iconWrapClass
                  )}
                >
                  <Image
                    src={action.iconSrc}
                    alt={action.iconAlt}
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-white">{action.label}</span>
                  <small className="text-xs text-white/70">{action.hint}</small>
                </span>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="surface-glass overflow-hidden">
            <div className="map-frame relative aspect-[4/3] w-full bg-[#0a1218]">
              <iframe
                title={t("ubicacion.title")}
                src={LINKS.mapsEmbed}
                className="map-frame__iframe absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="map-frame__veil pointer-events-none absolute inset-0" aria-hidden />
              <a
                href={LINKS.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-[12px] border border-white/25 bg-black/65 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/80"
              >
                {t("ubicacion.openMaps")}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="border-t border-white/15 px-5 py-4">
              <p className="font-heading text-xl font-semibold text-white">QJRR+HH2</p>
              <p className="text-sm text-white/70">San Juan Opico, La Libertad</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
