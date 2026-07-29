"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  HeartHandshake,
  Music2,
  Share2,
  SprayCan,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { useCalendarModal } from "@/components/providers/calendar-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { EVENTS, MINISTRIES } from "@/lib/constants";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ministryIcons: Record<(typeof MINISTRIES)[number]["icon"], LucideIcon> = {
  book: BookOpen,
  music: Music2,
  welcome: HeartHandshake,
  child: GraduationCap,
  clean: SprayCan,
};

const eventIcons: Record<(typeof EVENTS)[number]["icon"], LucideIcon> = {
  calendar: CalendarDays,
  heart: HeartHandshake,
  share: Share2,
};

const eventCardStyles: Record<
  (typeof EVENTS)[number]["id"],
  {
    image: string;
    href?: string;
    openCalendar?: boolean;
    linkKey: string;
    accentIcon: string;
    accentTag: string;
    accentLink: string;
  }
> = {
  upcoming: {
    image: "/assets/fotos/congregacion-culto-lateral.png",
    openCalendar: true,
    linkKey: "eventos.item1Link",
    accentIcon: "border-white/30 bg-[#65101a] text-white shadow-sm",
    accentTag: "text-[#ffc9d0]",
    accentLink: "text-[#ffc9d0] hover:text-white",
  },
  help: {
    image: "/assets/fotos/ayuda-comunidad-ninos.png",
    href: "#ayuda",
    linkKey: "eventos.item2Link",
    accentIcon: "border-white/30 bg-amber-600 text-white shadow-sm",
    accentTag: "text-[#ffe08a]",
    accentLink: "text-[#ffe08a] hover:text-white",
  },
  social: {
    image: "/assets/fotos/presentacion-ninos-escenario.png",
    href: "#redes",
    linkKey: "eventos.item3Link",
    accentIcon: "border-white/30 bg-sky-600 text-white shadow-sm",
    accentTag: "text-[#b8e4ff]",
    accentLink: "text-[#b8e4ff] hover:text-white",
  },
};

export function Eventos() {
  const { t } = useLanguage();
  const { openCalendar } = useCalendarModal();

  return (
    <section id="eventos" className="section-padding section-surface-alt">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="eyebrow">{t("eventos.eyebrow")}</p>
          <h2 className="section-title">{t("eventos.title")}</h2>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {EVENTS.map((event, index) => {
            const Icon = eventIcons[event.icon];
            const style = eventCardStyles[event.id];
            const linkClass = cn(
              "mt-auto text-left text-sm font-semibold transition-colors duration-200",
              style.accentLink
            );
            return (
              <Reveal key={event.id} delay={index * 0.05}>
                <Card className="group relative h-full gap-0 overflow-hidden border-black/20 bg-neutral-900 p-0 shadow-none ring-0 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.45)]">
                  <Image
                    src={style.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10"
                    aria-hidden
                  />
                  <CardContent className="relative z-10 flex h-full min-h-[280px] flex-col gap-5 px-6 py-6 sm:px-7 sm:py-7">
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={cn(
                          "inline-flex h-10 w-10 items-center justify-center rounded-full border",
                          style.accentIcon
                        )}
                        aria-hidden
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.5} />
                      </span>
                      <span
                        className={cn(
                          "rounded-sm bg-black/45 px-2 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] backdrop-blur-[2px]",
                          style.accentTag
                        )}
                      >
                        {t(event.tagKey)}
                      </span>
                    </div>
                    <div className="space-y-2 rounded-md bg-black/40 p-3 backdrop-blur-[2px]">
                      <h3 className="font-heading text-xl font-semibold tracking-tight text-white drop-shadow-sm">
                        {t(event.titleKey)}
                      </h3>
                      <p className="text-sm leading-relaxed text-white/95">{t(event.descKey)}</p>
                    </div>
                    {style.openCalendar ? (
                      <button type="button" onClick={openCalendar} className={linkClass}>
                        {t(style.linkKey)}
                      </button>
                    ) : (
                      <Link href={style.href!} className={linkClass}>
                        {t(style.linkKey)}
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Ministerios() {
  const { t } = useLanguage();

  return (
    <section id="ministerios" className="section-padding section-surface">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="eyebrow">{t("ministerios.eyebrow")}</p>
          <h2 className="section-title">{t("ministerios.title")}</h2>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {MINISTRIES.map((ministry, index) => {
            const Icon = ministryIcons[ministry.icon];
            const number = String(index + 1).padStart(2, "0");
            return (
              <Reveal
                key={ministry.id}
                delay={index * 0.05}
                className={cn("sm:col-span-1 lg:col-span-2", index === 3 && "lg:col-start-2")}
              >
                <Card className="group h-full gap-0 overflow-hidden rounded-[12px] border border-black/25 bg-white p-0 shadow-none ring-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_24px_-10px_rgba(0,0,0,0.2)] dark:border-white/20 dark:bg-card">
                  <CardContent className="relative flex h-full min-h-[168px] gap-0 p-0">
                    <div className="flex w-14 shrink-0 flex-col items-center justify-center bg-neutral-950 px-2 py-6 dark:bg-black">
                      <span
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/80 text-white transition-colors duration-200 group-hover:bg-white group-hover:text-neutral-950"
                        aria-hidden
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                    </div>

                    <div className="relative flex flex-1 flex-col justify-center px-5 py-6 sm:px-6">
                      <span
                        className="pointer-events-none absolute right-4 top-4 font-sans text-[0.7rem] font-light tracking-[0.14em] text-foreground/25 dark:text-white/25"
                        aria-hidden
                      >
                        {number}
                      </span>

                      <div className="relative max-w-[15rem] pl-3 pt-2">
                        <span
                          className="pointer-events-none absolute -left-0.5 -top-1 h-10 w-10 border-l border-t border-neutral-900 dark:border-white/70"
                          aria-hidden
                        />
                        <span
                          className="pointer-events-none absolute -bottom-1 -right-2 h-10 w-10 border-b border-r border-neutral-900 dark:border-white/70"
                          aria-hidden
                        />
                        <h3 className="font-heading text-[1.35rem] font-semibold leading-snug tracking-tight text-foreground">
                          {t(ministry.titleKey)}
                        </h3>
                      <p className="mt-2 font-sans text-[0.8rem] font-normal leading-relaxed text-foreground/85">
                        {t(ministry.descKey)}
                      </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-10">
          <div className="flex flex-col items-center justify-between gap-4 rounded-[12px] border border-white/15 bg-black/45 p-6 text-center backdrop-blur-sm sm:flex-row sm:text-left">
            <p className="font-heading text-lg font-semibold text-[#e8c4a8]">
              {t("ministerios.calloutText")}
            </p>
            <a
              href={buildWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border-white/30 bg-transparent text-[#f5f5f5] hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-shekinah"
              )}
            >
              {t("ministerios.calloutBtn")}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
