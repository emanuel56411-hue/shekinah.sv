"use client";

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { useLanguage } from "@/components/providers/language-provider";
import { LINKS } from "@/lib/constants";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type DirectionAction = {
  href: string;
  label: string;
  hint: string;
  iconSrc: string;
  iconAlt: string;
  iconWrapClass: string;
  className: string;
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
      className: "hover:border-white/35 hover:bg-white/95",
    },
    {
      href: LINKS.waze,
      label: t("ubicacion.wazeBtn"),
      hint: t("ubicacion.wazeHint"),
      iconSrc: "/assets/icons/waze.png",
      iconAlt: "Waze",
      iconWrapClass: "bg-black",
      className: "hover:border-white/35 hover:bg-white/95",
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
                  "surface-porcelain group flex items-center gap-3 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah",
                  action.className
                )}
              >
                <span
                  className={cn(
                    "relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
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
                  <span className="block font-semibold text-foreground">{action.label}</span>
                  <small className="text-xs text-muted-foreground">{action.hint}</small>
                </span>
              </a>
            ))}
          </div>
          <a
            href={buildWhatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="surface-glass mt-4 inline-flex max-w-full items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah"
          >
            <MessageCircle className="h-4 w-4 shrink-0 text-[#25D366]" />
            <span className="min-w-0 break-words">
              {t("ubicacion.whatsappBtn")} — {t("ubicacion.whatsappHint")}
            </span>
          </a>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="surface-porcelain overflow-hidden">
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
            <div className="border-t border-black/20 px-5 py-4">
              <p className="text-sm uppercase tracking-wide text-muted-foreground">{t("nav.ubicacion")}</p>
              <p className="font-heading text-xl font-semibold text-foreground">QJRR+HH2</p>
              <p className="text-sm text-muted-foreground">San Juan Opico, La Libertad</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
