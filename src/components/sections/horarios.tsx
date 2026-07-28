"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { useLanguage } from "@/components/providers/language-provider";
import { SCHEDULE, SUNDAY_SCHEDULE } from "@/lib/constants";
import { getUpcomingServices } from "@/lib/schedule";
import { cn } from "@/lib/utils";

const DAY_ABBR: Record<string, { es: string; en: string }> = {
  "common.tuesday": { es: "MAR", en: "TUE" },
  "common.thursday": { es: "JUE", en: "THU" },
  "common.saturday": { es: "SÁB", en: "SAT" },
  "common.sunday": { es: "DOM", en: "SUN" },
};

/** Estilo A = texto a la derecha; B = franja blanca con hora rotada (como la referencia). */
type CardLayout = "right" | "sidebar";

const CARD_META: Record<
  string,
  { image: string; alt: string; tint: string; layout: CardLayout }
> = {
  "schedule.tuesdayActivity": {
    image: "/assets/fotos/predicacion-shekinah.webp",
    alt: "Predicación y estudio bíblico",
    tint: "#65101a",
    layout: "right",
  },
  "schedule.thursdayActivity": {
    image: "/assets/fotos/predicacion-horarios.webp",
    alt: "Enseñanza y estudio bíblico",
    tint: "#4a0c14",
    layout: "sidebar",
  },
  "schedule.saturdayActivity": {
    image: "/assets/fotos/equipo-alabanza.webp",
    alt: "Alabanza y culto de jóvenes",
    tint: "#8b1e2d",
    layout: "sidebar",
  },
};

const SUNDAY_META = {
  image: "/assets/fotos/congregacion-culto.webp",
  alt: "Congregación en culto dominical",
  tint: "#65101a",
  layout: "right" as const,
};

function matchNextId(titleKey: string, nextId: string | null): boolean {
  if (!nextId) return false;
  if (titleKey === "schedule.tuesdayActivity") return nextId === "tuesday";
  if (titleKey === "schedule.thursdayActivity") return nextId === "thursday";
  if (titleKey === "schedule.saturdayActivity") return nextId === "saturday";
  if (titleKey === "schedule.sunday1Activity") return nextId === "sunday1";
  if (titleKey === "schedule.sunday2Activity") return nextId === "sunday2";
  return false;
}

/** Convierte "7:00 p.m. - 8:30 p.m." → "7PM" para la franja lateral. */
function shortTime(time: string) {
  const match = time.match(/(\d{1,2})(?::\d{2})?\s*(a\.m\.|p\.m\.|am|pm)/i);
  if (!match) return time;
  const period = /p/i.test(match[2]) ? "PM" : "AM";
  return `${match[1]}${period}`;
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex w-fit rounded-full bg-white/25 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white shadow-sm backdrop-blur-sm">
      {label}
    </span>
  );
}

export function Horarios() {
  const { t, lang } = useLanguage();
  const [nextId, setNextId] = useState<string | null>(null);
  const [nextDayKey, setNextDayKey] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const [next] = getUpcomingServices(new Date(), 1);
      setNextId(next?.id ?? null);
      setNextDayKey(next?.dayKey ?? null);
      setIsLive(Boolean(next?.isLive));
    };
    refresh();
    const id = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const sundayHasNext =
    matchNextId("schedule.sunday1Activity", nextId) ||
    matchNextId("schedule.sunday2Activity", nextId);

  const statusLabel = isLive ? t("heroPanel.live") : t("heroPanel.next");

  return (
    <section id="reuniones" className="section-padding section-surface-alt">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <Reveal>
          <p className="eyebrow">{t("reuniones.eyebrow")}</p>
          <h2 className="section-title">{t("reuniones.title")}</h2>
          <p className="section-desc">{t("reuniones.description")}</p>
          {nextDayKey ? (
            <p className="mt-3 text-sm font-medium text-shekinah">
              {statusLabel}: {t(nextDayKey)}
            </p>
          ) : null}
        </Reveal>

        <div className="space-y-3">
          {SCHEDULE.map((item, index) => {
            const isNext = matchNextId(item.titleKey, nextId);
            const meta = CARD_META[item.titleKey] ?? CARD_META["schedule.tuesdayActivity"];
            const day = DAY_ABBR[item.dayKey]?.[lang] ?? "";
            const activity = t(item.titleKey);
            const isSidebar = meta.layout === "sidebar";

            return (
              <Reveal key={item.titleKey} delay={index * 0.06}>
                <article
                  className={cn(
                    "relative flex min-h-[7.75rem] overflow-hidden rounded-2xl text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.45)] sm:min-h-[8.5rem]",
                    isNext &&
                      "ring-2 ring-white/85 ring-offset-2 ring-offset-[hsl(var(--background))]"
                  )}
                >
                  <Image
                    src={meta.image}
                    alt={meta.alt}
                    fill
                    className="object-cover object-center grayscale-[30%]"
                    sizes="(max-width: 1024px) 100vw, 560px"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background: isSidebar
                        ? `linear-gradient(90deg, ${meta.tint}cc 0%, ${meta.tint}99 55%, ${meta.tint}66 100%)`
                        : `linear-gradient(90deg, ${meta.tint}55 0%, ${meta.tint}aa 45%, ${meta.tint}f2 100%)`,
                    }}
                  />

                  {isSidebar ? (
                    <>
                      <div className="relative z-10 flex w-11 shrink-0 items-center justify-center bg-white sm:w-12">
                        <span className="origin-center -rotate-90 whitespace-nowrap text-sm font-extrabold tracking-wide text-[#1a1a1a] sm:text-base">
                          {shortTime(item.time)}
                        </span>
                      </div>
                      <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-center gap-1.5 px-4 py-4 sm:px-5">
                        {isNext ? <StatusBadge label={statusLabel} /> : null}
                        <p className="font-sans text-3xl font-extrabold uppercase leading-none tracking-tight sm:text-4xl">
                          {day}
                        </p>
                        <p className="text-sm font-medium uppercase tracking-wide text-white/95 sm:text-base">
                          {activity}
                        </p>
                        <time className="text-xs font-semibold text-white/85 sm:text-sm">{item.time}</time>
                      </div>
                    </>
                  ) : (
                    <div className="relative z-10 flex min-w-0 flex-1 flex-col items-end justify-center gap-1.5 px-5 py-4 text-right sm:px-6">
                      {isNext ? <StatusBadge label={statusLabel} /> : null}
                      <p className="font-sans text-3xl font-extrabold uppercase leading-none tracking-tight sm:text-4xl">
                        {day}
                      </p>
                      <p className="max-w-[16rem] text-sm font-medium uppercase tracking-wide text-white/95 sm:text-base">
                        {activity}
                      </p>
                      <time className="text-xs font-semibold text-white/85 sm:text-sm">{item.time}</time>
                    </div>
                  )}
                </article>
              </Reveal>
            );
          })}

          <Reveal delay={0.2}>
            <article
              className={cn(
                "relative flex min-h-[9rem] overflow-hidden rounded-2xl text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.45)] sm:min-h-[9.75rem]",
                sundayHasNext &&
                  "ring-2 ring-white/85 ring-offset-2 ring-offset-[hsl(var(--background))]"
              )}
            >
              <Image
                src={SUNDAY_META.image}
                alt={SUNDAY_META.alt}
                fill
                className="object-cover object-center grayscale-[30%]"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, ${SUNDAY_META.tint}55 0%, ${SUNDAY_META.tint}aa 45%, ${SUNDAY_META.tint}f2 100%)`,
                }}
              />

              <div className="relative z-10 flex min-w-0 flex-1 flex-col items-end justify-center gap-2 px-5 py-4 text-right sm:px-6">
                {sundayHasNext ? <StatusBadge label={statusLabel} /> : null}
                <p className="font-sans text-3xl font-extrabold uppercase leading-none tracking-tight sm:text-4xl">
                  {DAY_ABBR["common.sunday"]?.[lang] ?? "DOM"}
                </p>
                {SUNDAY_SCHEDULE.map((item) => {
                  const isNext = matchNextId(item.titleKey, nextId);
                  return (
                    <div
                      key={item.titleKey}
                      className={cn(
                        "flex max-w-[18rem] flex-col items-end gap-0.5",
                        isNext && "rounded-md bg-white/15 px-2 py-1.5"
                      )}
                    >
                      <span className="text-sm font-medium uppercase tracking-wide text-white/95 sm:text-base">
                        {t(item.titleKey)}
                      </span>
                      <time className="text-xs font-semibold text-white/85 sm:text-sm">{item.time}</time>
                    </div>
                  );
                })}
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
