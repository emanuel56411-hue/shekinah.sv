"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { useLanguage } from "@/components/providers/language-provider";
import { LINKS } from "@/lib/constants";

export function AnniversaryNote() {
  const { t } = useLanguage();

  return (
    <Reveal className="border-y border-border/60 bg-muted/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center sm:flex-row sm:justify-center sm:gap-5 sm:px-6">
        <p className="inline-flex items-center gap-2 rounded-full bg-shekinah px-4 py-2 text-sm font-bold text-white shadow-card">
          <span className="text-2xl leading-none">19</span>
          <span>{t("anniversary.years")}</span>
        </p>
        <p className="max-w-xl text-base text-muted-foreground">{t("anniversary.text")}</p>
      </div>
    </Reveal>
  );
}

export function QuickStrip() {
  const { t } = useLanguage();

  const items = [
    { href: "#reuniones", title: t("quickStrip.visitTitle"), desc: t("quickStrip.visitDesc") },
    { href: LINKS.waze, title: t("quickStrip.locationTitle"), desc: t("quickStrip.locationDesc"), external: true },
    { href: "#ayuda", title: t("quickStrip.prayerTitle"), desc: t("quickStrip.prayerDesc") },
    { href: "#redes", title: t("quickStrip.socialTitle"), desc: t("quickStrip.socialDesc") },
  ];

  return (
    <nav aria-label={t("quickStrip.aria")} className="bg-background">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 py-8 sm:grid-cols-4 sm:px-6">
        {items.map((item, index) => (
          <Reveal key={item.href} delay={index * 0.05}>
            {item.external ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-border/70 bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-shekinah/30 hover:shadow-card-hover"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-shekinah">{item.title}</span>
                <strong className="mt-1 block text-sm font-semibold text-foreground group-hover:text-shekinah">
                  {item.desc}
                </strong>
              </a>
            ) : (
              <Link
                href={item.href}
                className="group block rounded-xl border border-border/70 bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-shekinah/30 hover:shadow-card-hover"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-shekinah">{item.title}</span>
                <strong className="mt-1 block text-sm font-semibold text-foreground group-hover:text-shekinah">
                  {item.desc}
                </strong>
              </Link>
            )}
          </Reveal>
        ))}
      </div>
    </nav>
  );
}
