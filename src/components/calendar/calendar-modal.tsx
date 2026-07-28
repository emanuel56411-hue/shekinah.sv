"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import {
  CALENDAR_EVENTS,
  eventsForDate,
  hasEventsOnDate,
  toDateKey,
} from "@/lib/calendar-events";
import { cn } from "@/lib/utils";

type CalendarModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Cell = {
  date: Date;
  inMonth: boolean;
  key: string;
};

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function buildMonthGrid(viewDate: Date): Cell[] {
  const first = startOfMonth(viewDate);
  const startWeekday = first.getDay(); // 0 = Sunday
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - startWeekday);

  const cells: Cell[] = [];
  for (let i = 0; i < 42; i += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    cells.push({
      date,
      inMonth: date.getMonth() === viewDate.getMonth(),
      key: toDateKey(date),
    });
  }
  return cells;
}

export function CalendarModal({ open, onOpenChange }: CalendarModalProps) {
  const { t, lang } = useLanguage();
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);
  const todayKey = toDateKey(today);

  const [viewDate, setViewDate] = useState(() => startOfMonth(new Date()));
  const [selectedKey, setSelectedKey] = useState<string | null>(todayKey);

  useEffect(() => {
    if (!open) return;
    setViewDate(startOfMonth(new Date()));
    setSelectedKey(toDateKey(new Date()));
  }, [open]);

  const cells = useMemo(() => buildMonthGrid(viewDate), [viewDate]);
  const selectedEvents = selectedKey ? eventsForDate(selectedKey, CALENDAR_EVENTS) : [];

  const monthLabel = viewDate.toLocaleDateString(lang === "es" ? "es-SV" : "en-US", {
    month: "long",
    year: "numeric",
  });

  const weekdays =
    lang === "es"
      ? ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const goMonth = (delta: number) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const goToday = () => {
    setViewDate(startOfMonth(today));
    setSelectedKey(todayKey);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        overlayClassName="z-[110]"
        className="z-[120] max-h-[min(92vh,44rem)] w-full max-w-lg overflow-y-auto p-4 sm:p-5"
        aria-describedby={undefined}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="font-heading text-xl font-semibold text-foreground">
            {t("calendar.title")}
          </DialogTitle>
          <DialogDescription>{t("calendar.description")}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => goMonth(-1)}
            className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "shrink-0")}
            aria-label={t("calendar.prevMonth")}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="min-w-0 text-center">
            <p className="truncate font-heading text-base font-semibold capitalize text-foreground sm:text-lg">
              {monthLabel}
            </p>
          </div>

          <button
            type="button"
            onClick={() => goMonth(1)}
            className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "shrink-0")}
            aria-label={t("calendar.nextMonth")}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={goToday}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "border-shekinah/30 text-shekinah hover:bg-shekinah hover:text-white"
            )}
          >
            {t("calendar.today")}
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {weekdays.map((day) => (
            <div
              key={day}
              className="py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground"
            >
              {day}
            </div>
          ))}

          {cells.map((cell) => {
            const isToday = cell.key === todayKey;
            const isSelected = cell.key === selectedKey;
            const hasEvent = hasEventsOnDate(cell.key, CALENDAR_EVENTS);

            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => setSelectedKey(cell.key)}
                className={cn(
                  "relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah",
                  cell.inMonth ? "text-foreground" : "text-muted-foreground/45",
                  isSelected && "bg-shekinah text-white",
                  !isSelected && isToday && "bg-shekinah/10 font-bold text-shekinah",
                  !isSelected && !isToday && "hover:bg-muted"
                )}
                aria-label={cell.date.toLocaleDateString(lang === "es" ? "es-SV" : "en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
                aria-pressed={isSelected}
              >
                <span className={cn(isToday && !isSelected && "inline-flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-shekinah/40")}>
                  {cell.date.getDate()}
                </span>
                {hasEvent ? (
                  <span
                    className={cn(
                      "absolute bottom-1 h-1.5 w-1.5 rounded-full",
                      isSelected ? "bg-white" : "bg-shekinah"
                    )}
                    aria-hidden
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-black/15 bg-[#FAF8F3] p-3 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-shekinah">
            {selectedKey
              ? new Date(`${selectedKey}T12:00:00`).toLocaleDateString(
                  lang === "es" ? "es-SV" : "en-US",
                  { weekday: "long", day: "numeric", month: "long", year: "numeric" }
                )
              : t("calendar.pickDay")}
          </p>

          {selectedEvents.length > 0 ? (
            <ul className="mt-3 space-y-3">
              {selectedEvents.map((event) => (
                <li key={`${event.fecha}-${event.titulo}-${event.hora}`} className="border-t border-black/10 pt-3 first:border-t-0 first:pt-0">
                  <p className="font-heading text-base font-semibold text-foreground">{event.titulo}</p>
                  <p className="mt-0.5 text-sm font-medium text-shekinah">{event.hora}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{event.descripcion}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">{t("calendar.noEvents")}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
