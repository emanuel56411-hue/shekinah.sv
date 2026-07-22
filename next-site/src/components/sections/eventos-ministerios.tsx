"use client";

import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { EVENTS, MINISTRIES } from "@/lib/constants";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Eventos() {
  const { t } = useLanguage();

  return (
    <section id="eventos" className="section-padding bg-muted/30">
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
    <section id="ministerios" className="section-padding">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="eyebrow">{t("ministerios.eyebrow")}</p>
          <h2 className="section-title">{t("ministerios.title")}</h2>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MINISTRIES.map((ministry, index) => (
            <Reveal key={ministry.num} delay={index * 0.05}>
              <Card className="h-full shadow-card transition-all hover:-translate-y-1 hover:border-shekinah/25 hover:shadow-card-hover">
                <CardContent className="p-6">
                  <span className="text-3xl font-black text-shekinah/25">{ministry.num}</span>
                  <h3 className="mt-2 text-lg font-semibold">{t(ministry.titleKey)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t(ministry.descKey)}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-shekinah/20 bg-shekinah/5 p-6 text-center sm:flex-row sm:text-left">
            <p className="text-lg font-semibold">{t("ministerios.calloutText")}</p>
            <a
              href={buildWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants(), "bg-shekinah hover:bg-shekinah-900")}
            >
              {t("ministerios.calloutBtn")}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
