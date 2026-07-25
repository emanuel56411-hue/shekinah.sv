"use client";

import { Baby, BookOpen, HeartHandshake, Music2, Sparkles, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { EVENTS, MINISTRIES } from "@/lib/constants";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ministryIcons: Record<(typeof MINISTRIES)[number]["icon"], LucideIcon> = {
  book: BookOpen,
  music: Music2,
  welcome: HeartHandshake,
  child: Baby,
  clean: Sparkles,
};

export function Eventos() {
  const { t } = useLanguage();

  return (
    <section id="eventos" className="section-padding section-surface-alt">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="eyebrow">{t("eventos.eyebrow")}</p>
          <h2 className="section-title">{t("eventos.title")}</h2>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {EVENTS.map((event, index) => (
            <Reveal key={event.titleKey} delay={index * 0.07}>
              <Card className="h-full shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit bg-shekinah/10 text-shekinah">
                    {t(event.tagKey)}
                  </Badge>
                  <CardTitle>{t(event.titleKey)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{t(event.descKey)}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
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

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MINISTRIES.map((ministry, index) => {
            const Icon = ministryIcons[ministry.icon];
            return (
              <Reveal key={ministry.id} delay={index * 0.05}>
                <Card className="h-full border-black/20 shadow-none transition-all hover:border-shekinah/35 hover:shadow-card">
                  <CardContent className="flex h-full flex-col gap-4 p-6">
                    <span
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-shekinah/20 bg-shekinah/5 text-shekinah"
                      aria-hidden
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <div>
                      <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                        {t(ministry.titleKey)}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
          <div className="flex flex-col items-center justify-between gap-4 rounded-[12px] border border-black/20 bg-[#FAF8F3] p-6 text-center sm:flex-row sm:text-left">
            <p className="font-heading text-lg font-semibold text-foreground">
              {t("ministerios.calloutText")}
            </p>
            <a
              href={buildWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border-black/30 text-foreground hover:bg-white focus-visible:ring-2 focus-visible:ring-shekinah"
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
