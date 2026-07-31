"use client";

import {
  BookOpen,
  GraduationCap,
  HeartHandshake,
  Music2,
  SprayCan,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { useCalendarModal } from "@/components/providers/calendar-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { MINISTRIES } from "@/lib/constants";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ministryIcons: Record<(typeof MINISTRIES)[number]["icon"], LucideIcon> = {
  book: BookOpen,
  music: Music2,
  welcome: HeartHandshake,
  child: GraduationCap,
  clean: SprayCan,
};

export function Eventos() {
  const { t } = useLanguage();
  const { openCalendar } = useCalendarModal();

  return (
    <section id="eventos" className="section-padding section-surface-alt">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="eyebrow">{t("eventos.eyebrow")}</p>
          <h2 className="section-title">{t("eventos.title")}</h2>
          <p className="section-desc">{t("eventos.item1Desc")}</p>
          <button
            type="button"
            onClick={openCalendar}
            className={cn(
              buttonVariants({ size: "lg" }),
              "btn-skeuo mt-8 h-11 focus-visible:ring-2 focus-visible:ring-white"
            )}
          >
            {t("eventos.item1Link")}
          </button>
        </Reveal>
      </div>
    </section>
  );
}

export function Ministerios() {
  const { t } = useLanguage();

  return (
    <section id="ministerios" className="section-padding section-surface">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="eyebrow">{t("ministerios.eyebrow")}</p>
          <h2 className="section-title">{t("ministerios.title")}</h2>
        </Reveal>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MINISTRIES.map((ministry, index) => {
            const Icon = ministryIcons[ministry.icon];
            return (
              <Reveal key={ministry.id} delay={index * 0.04}>
                <Card className="surface-porcelain h-full gap-0 ring-0">
                  <CardContent className="flex items-start gap-4 p-5">
                    <span
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white"
                      aria-hidden
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-heading text-xl font-semibold leading-snug tracking-tight text-foreground">
                        {t(ministry.titleKey)}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
                        {t(ministry.descKey)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-10">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="font-heading text-lg font-semibold text-[#e8c4a8]">
              {t("ministerios.calloutText")}
            </p>
            <a
              href={buildWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "btn-skeuo border-transparent text-white hover:text-white focus-visible:ring-2 focus-visible:ring-shekinah"
              )}
            >
              {t("ministerios.calloutBtn")}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
