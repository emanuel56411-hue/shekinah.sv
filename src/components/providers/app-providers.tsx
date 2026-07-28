"use client";

import { CalendarProvider } from "@/components/providers/calendar-provider";
import { LanguageProvider } from "@/components/providers/language-provider";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <CalendarProvider>{children}</CalendarProvider>
    </LanguageProvider>
  );
}
