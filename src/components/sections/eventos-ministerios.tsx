"use client";

import Image from "next/image";
import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  DoorOpen,
  HandHeart,
  MessageCircle,
  Mic2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { useCalendarModal } from "@/components/providers/calendar-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { EVENTS, MINISTRIES } from "@/lib/constants";
import { buildWhatsappUrlForPhone } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const MINISTRY_ICONS: Record<string, LucideIcon> = {
  book: HandHeart,
  music: Mic2,
  welcome: DoorOpen,
  child: BookOpen,
  clean: Sparkles,
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
  const [openMinistryId, setOpenMinistryId] = useState<string | null>(null);

  return (
    <section id="ministerios" className="section-padding">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="section-title mt-0">{t("ministerios.title")}</h2>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {MINISTRIES.map((ministry, index) => {
            const number = String(index + 1).padStart(2, "0");
            const Icon = MINISTRY_ICONS[ministry.icon] ?? Sparkles;
            const title = t(ministry.titleKey);
            const isOpen = openMinistryId === ministry.id;
            const contactId = `ministerio-contacto-${ministry.id}`;
            const whatsappMessage = `Hola, me interesa servir en el ministerio de ${title}.`;
            return (
              <Reveal
                key={ministry.id}
                delay={index * 0.04}
                className={cn("min-w-0 lg:col-span-2", index === 3 && "lg:col-start-2")}
              >
                <article
                  data-ministry-frame
                  className="group relative flex h-full min-h-[178px] flex-col overflow-hidden rounded-[16px] px-4 py-4 transition-all duration-300 ease-out active:-translate-y-0.5 sm:px-5 sm:py-5 md:hover:-translate-y-1"
                >
                  <span
                    className="absolute inset-y-5 left-0 w-px rounded-full bg-[#8fa3b8]/55 transition-colors duration-300 group-hover:bg-[#d9c68a]/80"
                    aria-hidden
                  />
                  <button
                    type="button"
                    onClick={() => setOpenMinistryId(isOpen ? null : ministry.id)}
                    aria-expanded={isOpen}
                    aria-controls={contactId}
                    className="relative z-10 flex w-full items-start gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45"
                  >
                    <div className="flex shrink-0 flex-col items-center gap-2">
                      <span
                        className="font-heading text-2xl font-semibold leading-none text-[#d9c68a]"
                        aria-hidden
                      >
                        {number}
                      </span>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#8fa3b8]/12 text-[#d9c68a] ring-1 ring-[#8fa3b8]/25 transition-colors duration-300 group-hover:bg-[#8fa3b8]/18 group-hover:text-[#f1dda0]">
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <h3 className="font-heading text-[1.35rem] font-semibold leading-tight text-white">
                        {title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/70">
                        {t(ministry.descKey)}
                      </p>
                    </div>
                    <ChevronDown
                      className={cn(
                        "mt-1 h-4 w-4 shrink-0 text-white/55 transition-transform duration-300",
                        isOpen && "rotate-180 text-[#d9c68a]"
                      )}
                      aria-hidden
                    />
                  </button>

                  <div
                    id={contactId}
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="mt-4 border-t border-white/10 pt-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">
                          Líder
                        </p>
                        <p className="mt-1 font-heading text-lg font-semibold text-white">
                          {ministry.leader}
                        </p>
                        <a
                          href={buildWhatsappUrlForPhone(ministry.phone, whatsappMessage)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#8fa3b8] px-4 py-2.5 text-sm font-semibold text-[#111A2E] transition-colors hover:bg-[#9db0c4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                        >
                          <MessageCircle className="h-4 w-4" />
                          WhatsApp {ministry.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
