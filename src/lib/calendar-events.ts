export type CalendarEvent = {
  id?: string;
  fecha: string; // YYYY-MM-DD
  titulo: string;
  hora: string;
  descripcion: string;
};

export type SiteCalendarEventSource = {
  id: string;
  event_date: string;
  title: string;
  event_time: string;
  description: string;
  sort_order?: number;
};

export function siteCalendarEventsToCalendarEvents(events: SiteCalendarEventSource[]): CalendarEvent[] {
  return [...events]
    .sort((a, b) => {
      if (a.event_date !== b.event_date) return a.event_date.localeCompare(b.event_date);
      return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    })
    .map((event) => ({
      id: event.id,
      fecha: event.event_date,
      titulo: event.title,
      hora: event.event_time,
      descripcion: event.description,
    }));
}

/**
 * Eventos del calendario 2026.
 * Edita este array a mano para agregar, quitar o cambiar fechas.
 */
export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    fecha: "2026-07-28",
    titulo: "Estudio exegético",
    hora: "7:00 p.m. - 8:30 p.m.",
    descripcion: "Reunión de estudio bíblico los martes.",
  },
  {
    fecha: "2026-07-30",
    titulo: "Estudio bíblico",
    hora: "7:00 p.m. - 8:30 p.m.",
    descripcion: "Estudio bíblico de jueves en la iglesia.",
  },
  {
    fecha: "2026-08-01",
    titulo: "Culto de jóvenes",
    hora: "4:30 p.m. - 6:00 p.m.",
    descripcion: "Culto especial de jóvenes el sábado.",
  },
  {
    fecha: "2026-08-02",
    titulo: "Primer culto devocional",
    hora: "8:30 a.m. - 9:40 a.m.",
    descripcion: "Primer servicio dominical.",
  },
  {
    fecha: "2026-08-02",
    titulo: "Segundo culto devocional",
    hora: "10:00 a.m. - 11:30 a.m.",
    descripcion: "Segundo servicio dominical.",
  },
  {
    fecha: "2026-08-04",
    titulo: "Estudio exegético",
    hora: "7:00 p.m. - 8:30 p.m.",
    descripcion: "Reunión de estudio bíblico los martes.",
  },
  {
    fecha: "2026-08-06",
    titulo: "Estudio bíblico",
    hora: "7:00 p.m. - 8:30 p.m.",
    descripcion: "Estudio bíblico de jueves en la iglesia.",
  },
  {
    fecha: "2026-08-08",
    titulo: "Culto de jóvenes",
    hora: "4:30 p.m. - 6:00 p.m.",
    descripcion: "Culto especial de jóvenes el sábado.",
  },
  {
    fecha: "2026-08-09",
    titulo: "Primer culto devocional",
    hora: "8:30 a.m. - 9:40 a.m.",
    descripcion: "Primer servicio dominical.",
  },
  {
    fecha: "2026-08-09",
    titulo: "Segundo culto devocional",
    hora: "10:00 a.m. - 11:30 a.m.",
    descripcion: "Segundo servicio dominical.",
  },
  {
    fecha: "2026-09-15",
    titulo: "Noche de oración",
    hora: "7:00 p.m.",
    descripcion: "Tiempo especial de oración por la iglesia y la comunidad.",
  },
  {
    fecha: "2026-12-24",
    titulo: "Culto de Navidad",
    hora: "6:00 p.m.",
    descripcion: "Celebración navideña en familia.",
  },
];

export function eventsForDate(fecha: string, events: CalendarEvent[] = CALENDAR_EVENTS) {
  return events.filter((event) => event.fecha === fecha);
}

export function hasEventsOnDate(fecha: string, events: CalendarEvent[] = CALENDAR_EVENTS) {
  return events.some((event) => event.fecha === fecha);
}

export function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
