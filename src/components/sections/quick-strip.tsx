"use client";

import Link from "next/link";
import { ArrowUpRight, Clock3, HeartHandshake, MapPinned, Share2, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { useLanguage } from "@/components/providers/language-provider";
import { LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function AnniversaryNote() {
  const { t } = useLanguage();

  return (
    <Reveal className="border-y border-white/15 section-surface-alt">
      <div
        className="relative mx-auto flex max-w-6xl flex-col items-center gap-5 overflow-hidden px-4 py-12 text-center sm:flex-row sm:justify-center sm:gap-8 sm:px-6 sm:text-left"
        aria-label={t("anniversary.aria")}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,168,177,0.18)_0%,transparent_70%)] sm:left-[28%]"
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
        <p className="relative max-w-xl text-base text-[#f5f5f5] drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)] sm:text-lg">
          {t("anniversary.text")}
        </p>
      </div>
    </Reveal>
  );
}

export function QuickStrip() {
  const { t } = useLanguage();

  const items: {
    href: string;
    title: string;
    desc: string;
    external?: boolean;
    icon: LucideIcon;
  }[] = [
    {
      href: "#reuniones",
      title: t("quickStrip.visitTitle"),
      desc: t("quickStrip.visitDesc"),
      icon: Clock3,
    },
    {
      href: LINKS.waze,
      title: t("quickStrip.locationTitle"),
      desc: t("quickStrip.locationDesc"),
      external: true,
      icon: MapPinned,
    },
    {
      href: "#ayuda",
      title: t("quickStrip.prayerTitle"),
      desc: t("quickStrip.prayerDesc"),
      icon: HeartHandshake,
    },
    {
      href: "#redes",
      title: t("quickStrip.socialTitle"),
      desc: t("quickStrip.socialDesc"),
      icon: Share2,
    },
  ];

  const cardClass =
    "group relative flex h-full flex-col gap-4 overflow-hidden rounded-[12px] border border-black/12 bg-gradient-to-b from-white to-[#FAF8F3] p-5 shadow-[0_4px_18px_-6px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-1 hover:border-shekinah/35 hover:shadow-[0_12px_28px_-10px_rgba(101,16,26,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah";

  return (
    <nav aria-label={t("quickStrip.aria")} className="section-surface">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 py-10 sm:grid-cols-4 sm:gap-4 sm:px-6">
        {items.map((item, index) => {
          const Icon = item.icon;
          const content = (
            <>
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[3px] bg-shekinah/80 transition-colors duration-200 group-hover:bg-shekinah"
              />
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-shekinah/20 bg-shekinah/[0.06] text-shekinah transition-colors duration-200 group-hover:border-shekinah group-hover:bg-shekinah group-hover:text-white">
                  <Icon className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.5} />
                </span>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 text-foreground/25 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-shekinah"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </div>
              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-shekinah">
                  {item.title}
                </span>
                <strong className="mt-1.5 block font-heading text-[1.05rem] font-semibold leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-shekinah">
                  {item.desc}
                </strong>
              </div>
            </>
          );

          return (
            <Reveal key={item.href} delay={index * 0.04} className="h-full">
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(cardClass)}
                >
                  {content}
                </a>
              ) : (
                <Link href={item.href} className={cn(cardClass)}>
                  {content}
                </Link>
              )}
            </Reveal>
          );
        })}
      </div>
    </nav>
  );
}
