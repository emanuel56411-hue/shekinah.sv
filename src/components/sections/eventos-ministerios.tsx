"use client";

import Image from "next/image";
import {
  BookOpen,
  CalendarDays,
  DoorOpen,
  HandHelping,
  Music2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { useCalendarModal } from "@/components/providers/calendar-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { EVENTS, MINISTRIES } from "@/lib/constants";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MINISTRY_ICONS: Record<(typeof MINISTRIES)[number]["id"], LucideIcon> = {
  diaconado: HandHelping,
  alabanza: Music2,
  acomodacion: DoorOpen,
  escuela: BookOpen,
  aseo: Sparkles,
};

export function Eventos() {
  const { t } = useLanguage();
  const { openCalendar } = useCalendarModal();
  const event = EVENTS.find((item) => item.id === "upcoming");

  if (!event) return null;

  return (
    <section id="eventos" className="section-padding-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="section-title mt-0">{t("eventos.title")}</h2>
        </Reveal>

        <Reveal className="mx-auto mt-8 w-full max-w-lg">
          <Card className="group relative min-h-[240px] gap-0 overflow-hidden border-0 bg-transparent p-0 shadow-none ring-0 sm:min-h-[280px]">
            <Image
              src="/assets/fotos/congregacion-culto-lateral.webp"
              alt=""
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 512px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" aria-hidden />
            <CardContent className="relative z-10 flex min-h-[240px] flex-col gap-4 px-5 py-5 sm:min-h-[280px] sm:px-6 sm:py-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#65101a] text-white">
                <CalendarDays className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <div>
                <h3 className="font-heading text-xl font-semibold text-white">{t(event.titleKey)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/90">{t(event.descKey)}</p>
              </div>
              <button
                type="button"
                onClick={openCalendar}
                className="mt-auto text-left text-sm font-semibold text-[#f3c4cb] transition-colors hover:text-white"
              >
                {t("eventos.item1Link")}
              </button>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

export function Ministerios() {
  const { t } = useLanguage();

  return (
    <section id="ministerios" className="section-padding">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="section-title mt-0">{t("ministerios.title")}</h2>
        </Reveal>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {MINISTRIES.map((ministry, index) => {
            const number = String(index + 1).padStart(2, "0");
            const Icon = MINISTRY_ICONS[ministry.id];
            return (
              <Reveal
                key={ministry.id}
                delay={index * 0.04}
                className="w-full sm:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)]"
              >
                <article
                  data-ministry-frame
                  className="flex h-full items-start gap-3.5 rounded-[14px] px-4 py-4 sm:gap-4 sm:px-5 sm:py-5"
                >
                  <div className="flex shrink-0 flex-col items-center gap-2 pt-0.5">
                    <span
                      className="ministry-accent font-heading text-[1.65rem] font-semibold leading-none tracking-tight sm:text-[1.85rem]"
                      aria-hidden
                    >
                      {number}
                    </span>
                    <Icon
                      className="ministry-accent h-4 w-4 opacity-80"
                      strokeWidth={1.6}
                      aria-hidden
                    />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="font-heading text-[1.2rem] font-semibold leading-snug tracking-tight text-white sm:text-[1.3rem]">
                      {t(ministry.titleKey)}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                      {t(ministry.descKey)}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-10">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="font-heading text-lg font-semibold text-white/90">
              {t("ministerios.calloutText")}
            </p>
            <a
              href={buildWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "rounded-[12px] border-transparent bg-[#8fa3b8] text-[#111A2E] hover:bg-[#9db0c4] hover:text-[#111A2E]"
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
