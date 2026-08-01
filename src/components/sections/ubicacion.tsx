"use client";

import Image from "next/image";
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
          <p className="eyebrow">{t("ubicacion.eyebrow")}</p>
          <h2 className="section-title">{t("ubicacion.title")}</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {actions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "surface-glass group flex items-center gap-3 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah"
                )}
              >
                <span
                  className={cn(
                    "relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/15",
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
            <div className="relative aspect-[4/3] w-full bg-[#0a1218]">
              <iframe
                title={t("ubicacion.title")}
                src={LINKS.mapsEmbed}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
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
