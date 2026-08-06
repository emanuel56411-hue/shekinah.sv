"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BookMarked, BookOpen, Church, Users, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { useLanguage } from "@/components/providers/language-provider";
import { SCHEDULE, SUNDAY_SCHEDULE } from "@/lib/constants";
import {
  formatScheduleRange,
  getUpcomingServices,
  getUpcomingServicesFromSlots,
  siteSchedulesToServiceSlots,
} from "@/lib/schedule";
import { fetchPublicSiteSchedules, type PublicSiteSchedule } from "@/lib/supabase";
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

const DYNAMIC_DAY_ABBR: Record<number, { es: string; en: string }> = {
  0: { es: "DOM", en: "SUN" },
  1: { es: "LUN", en: "MON" },
  2: { es: "MAR", en: "TUE" },
  3: { es: "MIÉ", en: "WED" },
  4: { es: "JUE", en: "THU" },
  5: { es: "VIE", en: "FRI" },
  6: { es: "SÁB", en: "SAT" },
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

function iconForSchedule(title: string, fallback: LucideIcon) {
  const value = title.toLowerCase();
  if (value.includes("joven")) return Users;
  if (value.includes("bíblico") || value.includes("biblico")) return BookMarked;
  if (value.includes("culto")) return Church;
  if (value.includes("estudio")) return BookOpen;
  return fallback;
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
    <article className="relative py-3 sm:py-4">
      <div className="relative z-10 flex items-start gap-3 sm:gap-4">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] text-white sm:h-12 sm:w-12",
            isHighlighted ? "bg-[#4a4e57]" : "bg-[#3a3d45]"
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          {isHighlighted && statusLabel ? (
            <span className="mb-1.5 inline-flex rounded-full bg-white/10 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/85">
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
  const [siteSchedules, setSiteSchedules] = useState<PublicSiteSchedule[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchPublicSiteSchedules().then((rows) => {
      if (!cancelled && rows.length > 0) setSiteSchedules(rows);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const dynamicSlots = useMemo(
    () => (siteSchedules.length > 0 ? siteSchedulesToServiceSlots(siteSchedules) : []),
    [siteSchedules]
  );

  useEffect(() => {
    const refresh = () => {
      const [next] =
        dynamicSlots.length > 0
          ? getUpcomingServicesFromSlots(dynamicSlots, new Date(), 1)
          : getUpcomingServices(new Date(), 1);
      setNextId(next?.id ?? null);
      setIsLive(Boolean(next?.isLive));
    };
    refresh();
    const id = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(id);
  }, [dynamicSlots]);

  const hasDynamicSchedules = siteSchedules.length > 0;
  const regularDynamicSchedules = siteSchedules.filter((item) => item.day_of_week !== 0);
  const sundayDynamicSchedules = siteSchedules.filter((item) => item.day_of_week === 0);

  const sundayHasNext =
    hasDynamicSchedules
      ? sundayDynamicSchedules.some((item) => item.id === nextId)
      : matchNextId("schedule.sunday1Activity", nextId) ||
        matchNextId("schedule.sunday2Activity", nextId);

  const statusLabel = isLive ? t("heroPanel.live") : t("heroPanel.next");

  return (
    <section id="reuniones" className="section-padding relative">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="eyebrow">{t("reuniones.eyebrow")}</p>
          <h2 className="section-title">{t("reuniones.title")}</h2>
          <p className="section-desc">{t("reuniones.description")}</p>
        </Reveal>

        <div className="mx-auto mt-8 grid max-w-3xl gap-x-10 gap-y-2 sm:grid-cols-2">
          {hasDynamicSchedules
            ? regularDynamicSchedules.map((item, index) => {
                const isNext = item.id === nextId;
                const Icon = iconForSchedule(item.title, BookOpen);
                return (
                  <Reveal key={item.id} delay={index * 0.07}>
                    <ScheduleCard
                      day={DYNAMIC_DAY_ABBR[item.day_of_week]?.[lang] ?? item.day_label.slice(0, 3).toUpperCase()}
                      icon={Icon}
                      isHighlighted={isNext}
                      statusLabel={statusLabel}
                    >
                      <p className="text-sm text-white/90 sm:text-[0.95rem]">{item.title}</p>
                      <time className="block text-sm font-medium text-white/75">
                        {formatScheduleRange(item.start_time, item.end_time)}
                      </time>
                    </ScheduleCard>
                  </Reveal>
                );
              })
            : SCHEDULE.map((item, index) => {
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
              day={DYNAMIC_DAY_ABBR[0]?.[lang] ?? DAY_ABBR["common.sunday"]?.[lang] ?? "DOM"}
              icon={Church}
              isHighlighted={sundayHasNext}
              statusLabel={statusLabel}
            >
              <div className="space-y-2.5">
                {hasDynamicSchedules
                  ? sundayDynamicSchedules.map((item) => {
                      const isNext = item.id === nextId;
                      return (
                        <div key={item.id} className={cn(isNext && "text-white")}>
                          <p className="text-sm text-white/90 sm:text-[0.95rem]">{item.title}</p>
                          <time className="block text-sm font-medium text-white/75">
                            {formatScheduleRange(item.start_time, item.end_time)}
                          </time>
                        </div>
                      );
                    })
                  : SUNDAY_SCHEDULE.map((item) => {
                      const isNext = matchNextId(item.titleKey, nextId);
                      return (
                        <div key={item.titleKey} className={cn(isNext && "text-white")}>
                          <p className="text-sm text-white/90 sm:text-[0.95rem]">{t(item.titleKey)}</p>
                          <time className="block text-sm font-medium text-white/75">{item.time}</time>
                        </div>
                      );
                    })}
              </div>
            </ScheduleCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
