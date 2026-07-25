"use client";

import { useEffect, useState } from "react";
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
            <p className="mt-3 text-sm font-medium text-shekinah dark:text-shekinah-300">
              {statusLabel}: {t(nextDayKey)}
            </p>
          ) : null}
        </Reveal>

        <div className="space-y-3">
          {SCHEDULE.map((item, index) => {
            const isNext = matchNextId(item.titleKey, nextId);
            return (
              <Reveal key={item.titleKey} delay={index * 0.06}>
                <article
                  className={cn(
                    "flex items-stretch gap-4 rounded-xl bg-shekinah px-5 py-4 text-white shadow-[0_6px_18px_-6px_rgba(0,0,0,0.35)]",
                    isNext &&
                      "ring-2 ring-white/85 ring-offset-2 ring-offset-[hsl(var(--background))]"
                  )}
                >
                  <div className="flex min-w-[4.25rem] shrink-0 items-center sm:min-w-[5rem]">
                    <span className="font-sans text-[1.75rem] font-extrabold leading-none tracking-tight sm:text-4xl">
                      {DAY_ABBR[item.dayKey]?.[lang] ?? ""}
                    </span>
                  </div>
                  <div className="w-px shrink-0 self-stretch bg-white/45" aria-hidden />
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 py-0.5">
                    {isNext ? (
                      <span className="inline-flex w-fit rounded-full bg-white/20 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white">
                        {statusLabel}
                      </span>
                    ) : null}
                    <div className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3">
                      <time className="shrink-0 text-base font-bold leading-snug sm:text-lg">
                        {item.time}
                      </time>
                      <span className="text-sm font-normal leading-snug text-white/90 sm:text-[0.95rem]">
                        {t(item.titleKey)}
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}

          <Reveal delay={0.2}>
            <article
              className={cn(
                "flex items-stretch gap-4 rounded-xl bg-shekinah px-5 py-4 text-white shadow-[0_6px_18px_-6px_rgba(0,0,0,0.35)]",
                sundayHasNext &&
                  "ring-2 ring-white/85 ring-offset-2 ring-offset-[hsl(var(--background))]"
              )}
            >
              <div className="flex min-w-[4.25rem] shrink-0 items-center sm:min-w-[5rem]">
                <span className="font-sans text-[1.75rem] font-extrabold leading-none tracking-tight sm:text-4xl">
                  {DAY_ABBR["common.sunday"]?.[lang] ?? "DOM"}
                </span>
              </div>
              <div className="w-px shrink-0 self-stretch bg-white/45" aria-hidden />
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5 py-0.5">
                {sundayHasNext ? (
                  <span className="inline-flex w-fit rounded-full bg-white/20 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white">
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
                        isNext && "rounded-md bg-white/10 px-2 py-1.5 sm:-mx-2"
                      )}
                    >
                      <time className="shrink-0 text-base font-bold leading-snug sm:text-lg">
                        {item.time}
                      </time>
                      <span className="text-sm font-normal leading-snug text-white/90 sm:text-[0.95rem]">
                        {t(item.titleKey)}
                      </span>
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
