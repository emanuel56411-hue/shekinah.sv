"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type CalendarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openCalendar: () => void;
};

const CalendarContext = createContext<CalendarContextValue | null>(null);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(
    () => ({
      open,
      setOpen,
      openCalendar: () => setOpen(true),
    }),
    [open]
  );

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

export function useCalendarModal() {
  const ctx = useContext(CalendarContext);
  if (!ctx) {
    throw new Error("useCalendarModal must be used within CalendarProvider");
  }
  return ctx;
}
