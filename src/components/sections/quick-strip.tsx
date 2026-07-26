"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { useLanguage } from "@/components/providers/language-provider";
import { LINKS } from "@/lib/constants";

export function AnniversaryNote() {
  const { t } = useLanguage();

  return (
    <Reveal className="border-y border-black/30 section-surface-alt ">
      <div
        className="relative mx-auto flex max-w-6xl flex-col items-center gap-5 overflow-hidden px-4 py-12 text-center sm:flex-row sm:justify-center sm:gap-8 sm:px-6 sm:text-left"
        aria-label={t("anniversary.aria")}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(101,16,26,0.18)_0%,rgba(250,248,243,0)_70%)] sm:left-[28%]"
        />
        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-2 border-shekinah/40 bg-gradient-to-br from-white via-[#FAF8F3] to-shekinah/10 shadow-[0_8px_28px_-8px_rgba(101,16,26,0.35)] sm:h-32 sm:w-32">
          <div className="absolute inset-2 rounded-full border border-dashed border-shekinah/30" />
          <div className="relative text-center leading-none">
            <span className="font-heading text-5xl font-bold text-shekinah sm:text-6xl">19</span>
            <span className="mt-1 block text-[0.65rem] font-bold uppercase tracking-[0.18em] text-shekinah/80">
              {t("anniversary.years")}
            </span>
          </div>
        </div>
        <p className="relative max-w-xl text-base text-muted-foreground sm:text-lg">{t("anniversary.text")}</p>
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
    <nav aria-label={t("quickStrip.aria")} className="section-surface">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 py-8 sm:grid-cols-4 sm:px-6">
        {items.map((item, index) => (
          <Reveal key={item.href} delay={index * 0.04}>
            {item.external ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-black/35 bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-shekinah/30 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah "
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-shekinah ">
                  {item.title}
                </span>
                <strong className="mt-1 block text-sm font-semibold text-foreground group-hover:text-shekinah ">
                  {item.desc}
                </strong>
              </a>
            ) : (
              <Link
                href={item.href}
                className="group block rounded-xl border border-black/35 bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-shekinah/30 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah "
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-shekinah ">
                  {item.title}
                </span>
                <strong className="mt-1 block text-sm font-semibold text-foreground group-hover:text-shekinah ">
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
