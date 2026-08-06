export type ServiceSlot = {
  id: string;
  /** Día de la semana en calendario JS: 0 = domingo … 6 = sábado */
  day: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  dayKey: string;
  titleKey: string;
  timeLabel: string;
};

export type SiteScheduleSource = {
  id: string;
  day_of_week: number;
  day_label: string;
  title: string;
  start_time: string;
  end_time: string;
  sort_order?: number;
};

export type UpcomingService = ServiceSlot & {
  isLive: boolean;
  /** Minutos absolutos desde un ancla semanal (para ordenar) */
  sortKey: number;
};

export const SERVICE_SLOTS: ServiceSlot[] = [
  {
    id: "tuesday",
    day: 2,
    startHour: 19,
    startMinute: 0,
    endHour: 20,
    endMinute: 30,
    dayKey: "common.tuesday",
    titleKey: "schedule.tuesdayActivity",
    timeLabel: "7:00 p.m.",
  },
  {
    id: "thursday",
    day: 4,
    startHour: 19,
    startMinute: 0,
    endHour: 20,
    endMinute: 30,
    dayKey: "common.thursday",
    titleKey: "schedule.thursdayActivity",
    timeLabel: "7:00 p.m.",
  },
  {
    id: "saturday",
    day: 6,
    startHour: 16,
    startMinute: 30,
    endHour: 18,
    endMinute: 0,
    dayKey: "common.saturday",
    titleKey: "schedule.saturdayActivity",
    timeLabel: "4:30 p.m.",
  },
  {
    id: "sunday1",
    day: 0,
    startHour: 8,
    startMinute: 30,
    endHour: 9,
    endMinute: 40,
    dayKey: "common.sunday",
    titleKey: "schedule.sunday1Activity",
    timeLabel: "8:30 a.m.",
  },
  {
    id: "sunday2",
    day: 0,
    startHour: 10,
    startMinute: 0,
    endHour: 11,
    endMinute: 30,
    dayKey: "common.sunday",
    titleKey: "schedule.sunday2Activity",
    timeLabel: "10:00 a.m.",
  },
];

const TZ = "America/El_Salvador";

type TzParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: number;
};

function getTzParts(date: Date, timeZone = TZ): TzParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    weekday: "short",
  }).formatToParts(date);

  const map = Object.fromEntries(
    parts.filter((p) => p.type !== "literal").map((p) => [p.type, p.value])
  );

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  let hour = Number(map.hour);
  if (hour === 24) hour = 0;

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour,
    minute: Number(map.minute),
    second: Number(map.second),
    weekday: weekdayMap[map.weekday] ?? 0,
  };
}

function toMinutes(hour: number, minute: number): number {
  return hour * 60 + minute;
}

function parseClock(value: string) {
  const [hour = "0", minute = "0"] = value.split(":");
  return {
    hour: Number(hour) || 0,
    minute: Number(minute) || 0,
  };
}

export function formatScheduleTime(value: string): string {
  const { hour, minute } = parseClock(value);
  const period = hour >= 12 ? "p.m." : "a.m.";
  const normalized = hour % 12 || 12;
  return `${normalized}:${String(minute).padStart(2, "0")} ${period}`;
}

export function formatScheduleRange(start: string, end: string): string {
  return `${formatScheduleTime(start)} - ${formatScheduleTime(end)}`;
}

export function siteSchedulesToServiceSlots(schedules: SiteScheduleSource[]): ServiceSlot[] {
  return [...schedules]
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((schedule) => {
      const start = parseClock(schedule.start_time);
      const end = parseClock(schedule.end_time);
      return {
        id: schedule.id,
        day: schedule.day_of_week,
        startHour: start.hour,
        startMinute: start.minute,
        endHour: end.hour,
        endMinute: end.minute,
        dayKey: schedule.day_label,
        titleKey: schedule.title,
        timeLabel: formatScheduleTime(schedule.start_time),
      };
    });
}

/** Vista estable para SSR / primer paint (Domingo + Martes/Jueves). */
export function getDefaultHeroServices(): UpcomingService[] {
  const sunday = SERVICE_SLOTS.find((s) => s.id === "sunday1")!;
  const tuesday = SERVICE_SLOTS.find((s) => s.id === "tuesday")!;
  const thursday = SERVICE_SLOTS.find((s) => s.id === "thursday")!;

  return [
    { ...sunday, isLive: false, sortKey: 0, timeLabel: "8:30 a.m. y 10:00 a.m." },
    { ...tuesday, isLive: false, sortKey: 1 },
    { ...thursday, isLive: false, sortKey: 2 },
  ];
}

/**
 * Devuelve los próximos cultos según la hora en El Salvador.
 * Si hay uno en curso, ese va primero con `isLive: true`.
 */
export function getUpcomingServices(now = new Date(), count = 3): UpcomingService[] {
  return getUpcomingServicesFromSlots(SERVICE_SLOTS, now, count);
}

export function getUpcomingServicesFromSlots(
  slots: ServiceSlot[],
  now = new Date(),
  count = 3
): UpcomingService[] {
  const parts = getTzParts(now);
  const nowMinutes = toMinutes(parts.hour, parts.minute);
  const results: UpcomingService[] = [];

  for (let weekOffset = 0; weekOffset <= 1 && results.length < count; weekOffset++) {
    const ordered = [...slots].sort((a, b) => {
      const aKey = a.day * 1440 + toMinutes(a.startHour, a.startMinute);
      const bKey = b.day * 1440 + toMinutes(b.startHour, b.startMinute);
      return aKey - bKey;
    });

    for (const slot of ordered) {
      if (results.length >= count) break;

      const dayDiff = slot.day - parts.weekday + weekOffset * 7;
      if (weekOffset === 0 && dayDiff < 0) continue;

      const start = toMinutes(slot.startHour, slot.startMinute);
      const end = toMinutes(slot.endHour, slot.endMinute);

      if (weekOffset === 0 && dayDiff === 0 && nowMinutes >= end) continue;

      const isLive = weekOffset === 0 && dayDiff === 0 && nowMinutes >= start && nowMinutes < end;
      const sortKey = weekOffset * 7 * 1440 + slot.day * 1440 + start;

      if (results.some((r) => r.id === slot.id && r.sortKey === sortKey)) continue;

      results.push({ ...slot, isLive, sortKey });
    }
  }

  return results.slice(0, count);
}

/** Si el próximo es el primer culto del domingo (aún no empezó), usa ambos horarios. */
export function getFeaturedTimeLabel(featured: UpcomingService): string {
  if (featured.id === "sunday1" && !featured.isLive) {
    return "8:30 a.m. y 10:00 a.m.";
  }
  return featured.timeLabel;
}

/** Próximos cultos listos para la tarjeta del hero (evita duplicar el 2.º domingo). */
export function getHeroServices(now = new Date()): UpcomingService[] {
  const upcoming = getUpcomingServices(now, 4);
  const [featured, ...rest] = upcoming;
  if (!featured) return getDefaultHeroServices();

  if (featured.id === "sunday1" && !featured.isLive) {
    return [featured, ...rest.filter((s) => s.id !== "sunday2")].slice(0, 3);
  }

  return upcoming.slice(0, 3);
}
