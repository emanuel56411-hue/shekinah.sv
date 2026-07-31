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
    <Reveal className="section-surface">
      <div
        className="relative mx-auto flex max-w-6xl flex-col items-center gap-5 overflow-hidden px-4 py-12 text-center sm:flex-row sm:justify-center sm:gap-8 sm:px-6 sm:text-left"
        aria-label={t("anniversary.aria")}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(101,16,26,0.35)_0%,transparent_68%)] sm:left-[28%]"
        />
        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[3px] border-[#f4f0e8] bg-gradient-to-b from-[#8a1a28] via-[#65101a] to-[#4a0c14] shadow-[0_14px_36px_-8px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.14),inset_0_2px_0_rgba(255,255,255,0.28),inset_0_-2px_4px_rgba(0,0,0,0.35)] sm:h-32 sm:w-32">
          <div className="absolute inset-[7px] rounded-full border border-dashed border-[#ffc9d0]/70" />
          <div className="relative text-center leading-none">
            <span className="font-heading text-5xl font-bold text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.45)] sm:text-6xl">
              19
            </span>
            <span className="mt-1.5 block text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#f4f0e8]">
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
    "surface-glass surface-glass-lift group relative flex h-full flex-col gap-4 overflow-hidden p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah";

  return (
    <nav aria-label={t("quickStrip.aria")} className="section-surface">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 py-10 sm:grid-cols-4 sm:gap-4 sm:px-6">
        {items.map((item, index) => {
          const Icon = item.icon;
          const content = (
            <>
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[3px] bg-[#ffc9d0]/85 transition-colors duration-200 group-hover:bg-[#ffc9d0]"
              />
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-[#ffc9d0] transition-colors duration-200 group-hover:border-[#ffc9d0]/50 group-hover:bg-[#65101a] group-hover:text-white">
                  <Icon className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.5} />
                </span>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 text-white/35 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#ffc9d0]"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </div>
              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#ffc9d0] drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)]">
                  {item.title}
                </span>
                <strong className="mt-1.5 block font-heading text-[1.05rem] font-semibold leading-snug tracking-tight text-[#f5f5f5] transition-colors duration-200">
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
