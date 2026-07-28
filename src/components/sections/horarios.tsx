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

const SCHEDULE_IMAGES: Record<string, { src: string; alt: string }> = {
  "schedule.tuesdayActivity": {
    src: "/assets/fotos/predicacion-shekinah.webp",
    alt: "Predicación y estudio bíblico",
  },
  "schedule.thursdayActivity": {
    src: "/assets/fotos/predicacion-horarios.webp",
    alt: "Enseñanza y estudio bíblico",
  },
  "schedule.saturdayActivity": {
    src: "/assets/fotos/equipo-alabanza.webp",
    alt: "Alabanza y culto de jóvenes",
  },
};

const SUNDAY_IMAGE = {
  src: "/assets/fotos/congregacion-culto.webp",
  alt: "Congregación en culto dominical",
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
            const image = SCHEDULE_IMAGES[item.titleKey] ?? SCHEDULE_IMAGES["schedule.tuesdayActivity"];
            return (
              <Reveal key={item.titleKey} delay={index * 0.06}>
                <article
                  className={cn(
                    "relative min-h-[7.5rem] overflow-hidden rounded-2xl text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)] sm:min-h-[8.25rem]",
                    isNext &&
                      "ring-2 ring-white/85 ring-offset-2 ring-offset-[hsl(var(--background))]"
                  )}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 560px"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-r from-[#65101a]/95 via-[#65101a]/88 to-[#65101a]/62"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10"
                  />

                  <div className="relative z-10 flex h-full min-h-[7.5rem] items-stretch gap-4 px-5 py-4 sm:min-h-[8.25rem] sm:px-6">
                    <div className="flex min-w-[4.25rem] shrink-0 items-center sm:min-w-[5rem]">
                      <span className="font-sans text-[1.75rem] font-extrabold leading-none tracking-tight drop-shadow-sm sm:text-4xl">
                        {DAY_ABBR[item.dayKey]?.[lang] ?? ""}
                      </span>
                    </div>
                    <div className="w-px shrink-0 self-stretch bg-white/45" aria-hidden />
                    <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 py-0.5">
                      {isNext ? (
                        <span className="inline-flex w-fit rounded-full bg-white/25 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white shadow-sm backdrop-blur-sm">
                          {statusLabel}
                        </span>
                      ) : null}
                      <div className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3">
                        <time className="shrink-0 text-base font-bold leading-snug drop-shadow-sm sm:text-lg">
                          {item.time}
                        </time>
                        <span className="text-sm font-normal leading-snug text-white/95 sm:text-[0.95rem]">
                          {t(item.titleKey)}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}

          <Reveal delay={0.2}>
            <article
              className={cn(
                "relative min-h-[9rem] overflow-hidden rounded-2xl text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)] sm:min-h-[9.5rem]",
                sundayHasNext &&
                  "ring-2 ring-white/85 ring-offset-2 ring-offset-[hsl(var(--background))]"
              )}
            >
              <Image
                src={SUNDAY_IMAGE.src}
                alt={SUNDAY_IMAGE.alt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-r from-[#65101a]/95 via-[#65101a]/88 to-[#65101a]/62"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10"
              />

              <div className="relative z-10 flex h-full min-h-[9rem] items-stretch gap-4 px-5 py-4 sm:min-h-[9.5rem] sm:px-6">
                <div className="flex min-w-[4.25rem] shrink-0 items-center sm:min-w-[5rem]">
                  <span className="font-sans text-[1.75rem] font-extrabold leading-none tracking-tight drop-shadow-sm sm:text-4xl">
                    {DAY_ABBR["common.sunday"]?.[lang] ?? "DOM"}
                  </span>
                </div>
                <div className="w-px shrink-0 self-stretch bg-white/45" aria-hidden />
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5 py-0.5">
                  {sundayHasNext ? (
                    <span className="inline-flex w-fit rounded-full bg-white/25 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white shadow-sm backdrop-blur-sm">
                      {statusLabel}
                    </span>
                  ) : null}
                  {SUNDAY_SCHEDULE.map((item) => {
                    const isNext = matchNextId(item.titleKey, nextId);
                    return (
                      <div
                        key={item.titleKey}
                        className={cn(
                          "flex min-w-0 flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3",
                          isNext && "rounded-md bg-white/15 px-2 py-1.5 sm:-mx-2"
                        )}
                      >
                        <time className="shrink-0 text-base font-bold leading-snug drop-shadow-sm sm:text-lg">
                          {item.time}
                        </time>
                        <span className="text-sm font-normal leading-snug text-white/95 sm:text-[0.95rem]">
                          {t(item.titleKey)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
