"use client";

import { useEffect, useState, type ReactNode } from "react";
import { BookMarked, BookOpen, Church, Users, type LucideIcon } from "lucide-react";
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

const SCHEDULE_ICONS: Record<string, LucideIcon> = {
  "schedule.tuesdayActivity": BookOpen,
  "schedule.thursdayActivity": BookMarked,
  "schedule.saturdayActivity": Users,
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

function ScheduleCard({
  day,
  icon: Icon,
  isHighlighted,
  statusLabel,
  children,
}: {
  day: string;
  icon: LucideIcon;
  isHighlighted: boolean;
  statusLabel?: string | null;
  children: ReactNode;
}) {
  return (
    <article
      className={cn(
        "surface-glass relative overflow-hidden px-4 py-4 sm:px-5 sm:py-5",
        isHighlighted && "ring-1 ring-[#f3c4cb]/70"
      )}
    >
      <div className="relative z-10 flex items-start gap-3 sm:gap-4">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] text-white sm:h-12 sm:w-12",
            isHighlighted ? "bg-[#7a1f2e]" : "bg-[#65101a]"
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          {isHighlighted && statusLabel ? (
            <span className="mb-1.5 inline-flex rounded-full bg-white/10 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#f3c4cb]">
              {statusLabel}
            </span>
          ) : null}
          <p className="font-heading text-[1.55rem] font-semibold leading-none tracking-tight text-white sm:text-[1.75rem]">
            {day}
          </p>
          <div className="mt-1.5 space-y-1.5">{children}</div>
        </div>
      </div>
    </article>
  );
}

export function Horarios() {
  const { t, lang } = useLanguage();
  const [nextId, setNextId] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const [next] = getUpcomingServices(new Date(), 1);
      setNextId(next?.id ?? null);
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
    <section id="reuniones" className="section-padding section-surface relative overflow-hidden">
      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <Reveal>
          <p className="eyebrow">{t("reuniones.eyebrow")}</p>
          <h2 className="section-title">{t("reuniones.title")}</h2>
          <p className="section-desc">{t("reuniones.description")}</p>
        </Reveal>

        <div className="space-y-3">
          {SCHEDULE.map((item, index) => {
            const isNext = matchNextId(item.titleKey, nextId);
            const Icon = SCHEDULE_ICONS[item.titleKey] ?? BookOpen;
            return (
              <Reveal key={item.titleKey} delay={index * 0.07}>
                <ScheduleCard
                  day={DAY_ABBR[item.dayKey]?.[lang] ?? ""}
                  icon={Icon}
                  isHighlighted={isNext}
                  statusLabel={statusLabel}
                >
                  <p className="text-sm text-white/90 sm:text-[0.95rem]">{t(item.titleKey)}</p>
                  <time className="block text-sm font-medium text-white/75">{item.time}</time>
                </ScheduleCard>
              </Reveal>
            );
          })}

          <Reveal delay={0.24}>
            <ScheduleCard
              day={DAY_ABBR["common.sunday"]?.[lang] ?? "DOM"}
              icon={Church}
              isHighlighted={sundayHasNext}
              statusLabel={statusLabel}
            >
              {SUNDAY_SCHEDULE.map((item) => {
                const isNext = matchNextId(item.titleKey, nextId);
                return (
                  <div
                    key={item.titleKey}
                    className={cn(isNext && "rounded-md bg-white/5 px-2 py-1 sm:-mx-2")}
                  >
                    <p className="text-sm text-white/90 sm:text-[0.95rem]">{t(item.titleKey)}</p>
                    <time className="block text-sm font-medium text-white/75">{item.time}</time>
                  </div>
                );
              })}
            </ScheduleCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
