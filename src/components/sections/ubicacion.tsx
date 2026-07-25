"use client";

import type { ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { useLanguage } from "@/components/providers/language-provider";
import { LINKS } from "@/lib/constants";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

function GoogleMapsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#EA4335"
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
      />
      <circle cx="12" cy="9" r="2.5" fill="#fff" />
    </svg>
  );
}

function WazeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path
        fill="#111"
        d="M32 6c-12.4 0-22.5 9.3-22.5 22.3 0 7.6 3.5 13.2 7.8 18.3 1.6 1.9 2.6 4.1 2.6 6.5v1.4c0 1.8 1.5 3.3 3.3 3.3h17.6c1.8 0 3.3-1.5 3.3-3.3v-1.4c0-2.4 1-4.6 2.6-6.5 4.3-5.1 7.8-10.7 7.8-18.3C54.5 15.3 44.4 6 32 6z"
      />
      <circle cx="24.5" cy="26" r="3.2" fill="#fff" />
      <circle cx="39.5" cy="26" r="3.2" fill="#fff" />
      <path
        fill="none"
        stroke="#fff"
        strokeWidth="2.8"
        strokeLinecap="round"
        d="M23 35.5c2.8 3.2 6.2 4.8 9 4.8s6.2-1.6 9-4.8"
      />
      <circle cx="22" cy="52.5" r="4.2" fill="#111" stroke="#fff" strokeWidth="2.2" />
      <circle cx="42" cy="52.5" r="4.2" fill="#111" stroke="#fff" strokeWidth="2.2" />
      <circle cx="22" cy="52.5" r="1.6" fill="#fff" />
      <circle cx="42" cy="52.5" r="1.6" fill="#fff" />
    </svg>
  );
}

type DirectionAction = {
  href: string;
  label: string;
  hint: string;
  icon: (props: { className?: string }) => ReactNode;
  className: string;
};

export function Ubicacion() {
  const { t } = useLanguage();

  const actions: DirectionAction[] = [
    {
      href: LINKS.maps,
      label: t("ubicacion.mapsBtn"),
      hint: t("ubicacion.mapsHint"),
      icon: GoogleMapsIcon,
      className: "hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-950/30",
    },
    {
      href: LINKS.waze,
      label: t("ubicacion.wazeBtn"),
      hint: t("ubicacion.wazeHint"),
      icon: WazeIcon,
      className: "hover:border-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/30",
    },
  ];

  return (
    <section id="ubicacion" className="section-padding section-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-start">
        <Reveal>
          <p className="eyebrow">{t("ubicacion.eyebrow")}</p>
          <h2 className="section-title">{t("ubicacion.title")}</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <a
                  key={action.label}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group flex items-start gap-3 rounded-xl border border-black/35 bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah",
                    action.className
                  )}
                >
                  <Icon className="mt-0.5 h-8 w-8 shrink-0" />
                  <span className="min-w-0">
                    <span className="block font-semibold text-foreground">{action.label}</span>
                    <small className="text-xs text-muted-foreground">{action.hint}</small>
                  </span>
                </a>
              );
            })}
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
