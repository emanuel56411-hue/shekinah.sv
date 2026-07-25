"use client";

import { MapPin, MessageCircle, Navigation } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { useLanguage } from "@/components/providers/language-provider";
import { LINKS } from "@/lib/constants";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function Ubicacion() {
  const { t } = useLanguage();

  const actions = [
    {
      href: LINKS.maps,
      label: t("ubicacion.mapsBtn"),
      hint: t("ubicacion.mapsHint"),
      icon: MapPin,
      className: "hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-950/30",
      primary: true,
    },
    {
      href: LINKS.waze,
      label: t("ubicacion.wazeBtn"),
      hint: t("ubicacion.wazeHint"),
      icon: Navigation,
      className: "hover:border-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/30",
      primary: true,
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
                  "group flex flex-col rounded-xl border border-black/35 bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah",
                  action.className
                )}
              >
                <action.icon className="mb-2 h-5 w-5 text-shekinah" />
                <span className="font-semibold">{action.label}</span>
                <small className="text-xs text-muted-foreground">{action.hint}</small>
              </a>
            ))}
          </div>
          <a
            href={buildWhatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-shekinah hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah"
          >
            <MessageCircle className="h-4 w-4" />
            <span>
              {t("ubicacion.whatsappBtn")} — {t("ubicacion.whatsappHint")}
            </span>
          </a>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="overflow-hidden rounded-[12px] border border-black/35 bg-card shadow-card">
            <div className="relative aspect-[4/3] w-full bg-muted">
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
