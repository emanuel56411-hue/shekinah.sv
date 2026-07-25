"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { SCHEDULE, SUNDAY_SCHEDULE } from "@/lib/constants";
import { getUpcomingServices } from "@/lib/schedule";
import { cn } from "@/lib/utils";

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
  const { t } = useLanguage();
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

  return (
    <section id="reuniones" className="section-padding bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <Reveal>
          <p className="eyebrow">{t("reuniones.eyebrow")}</p>
          <h2 className="section-title">{t("reuniones.title")}</h2>
          <p className="section-desc">{t("reuniones.description")}</p>
          {nextDayKey ? (
            <p className="mt-3 text-sm font-medium text-shekinah">
              {isLive ? t("heroPanel.live") : t("heroPanel.next")}: {t(nextDayKey)}
            </p>
          ) : null}
        </Reveal>

        <div className="space-y-4">
          {SCHEDULE.map((item, index) => {
            const isNext = matchNextId(item.titleKey, nextId);
            return (
              <Reveal key={item.titleKey} delay={index * 0.06}>
                <Card
                  className={cn(
                    "shadow-card transition-all hover:shadow-card-hover",
                    isNext && "border-2 border-shekinah/40 ring-2 ring-shekinah/15"
                  )}
                >
                  <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge
                          variant={isNext ? "default" : "secondary"}
                          className={cn(
                            isNext
                              ? "bg-shekinah text-white"
                              : "bg-shekinah/10 text-shekinah"
                          )}
                        >
                          {t(item.dayKey)}
                        </Badge>
                        {isNext ? (
                          <span className="text-xs font-semibold uppercase tracking-wide text-shekinah">
                            {isLive ? t("heroPanel.live") : t("heroPanel.next")}
                          </span>
                        ) : null}
                      </div>
                      <h3 className="text-lg font-semibold">{t(item.titleKey)}</h3>
                    </div>
                    <time className="text-sm font-medium text-muted-foreground">{item.time}</time>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}

          <Reveal delay={0.2}>
            <div
              className={cn(
                "rounded-2xl border-2 bg-card p-2 shadow-card",
                sundayHasNext ? "border-shekinah/40" : "border-shekinah/20"
              )}
            >
              {SUNDAY_SCHEDULE.map((item) => {
                const isNext = matchNextId(item.titleKey, nextId);
                return (
                  <Card key={item.titleKey} className="mb-2 border-0 shadow-none last:mb-0">
                    <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <Badge
                            className={cn(
                              isNext || !nextId
                                ? "bg-shekinah text-white"
                                : "bg-shekinah/10 text-shekinah"
                            )}
                          >
                            {t(item.dayKey)}
                          </Badge>
                          {isNext ? (
                            <span className="text-xs font-semibold uppercase tracking-wide text-shekinah">
                              {isLive ? t("heroPanel.live") : t("heroPanel.next")}
                            </span>
                          ) : null}
                        </div>
                        <h3 className="text-lg font-semibold">{t(item.titleKey)}</h3>
                      </div>
                      <time className="text-sm font-medium text-muted-foreground">{item.time}</time>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
