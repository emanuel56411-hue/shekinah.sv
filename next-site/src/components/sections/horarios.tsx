"use client";

import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { SCHEDULE, SUNDAY_SCHEDULE } from "@/lib/constants";

export function Horarios() {
  const { t } = useLanguage();

  return (
    <section id="reuniones" className="section-padding bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <Reveal>
          <p className="eyebrow">{t("reuniones.eyebrow")}</p>
          <h2 className="section-title">{t("reuniones.title")}</h2>
          <p className="section-desc">{t("reuniones.description")}</p>
        </Reveal>

        <div className="space-y-4">
          {SCHEDULE.map((item, index) => (
            <Reveal key={item.titleKey} delay={index * 0.06}>
              <Card className="shadow-card transition-all hover:shadow-card-hover">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <div>
                    <Badge variant="secondary" className="mb-2 bg-shekinah/10 text-shekinah">
                      {t(item.dayKey)}
                    </Badge>
                    <h3 className="text-lg font-semibold">{t(item.titleKey)}</h3>
                  </div>
                  <time className="text-sm font-medium text-muted-foreground">{item.time}</time>
                </CardContent>
              </Card>
            </Reveal>
          ))}

          <Reveal delay={0.2}>
            <div className="rounded-2xl border-2 border-shekinah/20 bg-card p-2 shadow-card">
              {SUNDAY_SCHEDULE.map((item) => (
                <Card key={item.titleKey} className="mb-2 border-0 shadow-none last:mb-0">
                  <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
                    <div>
                      <Badge className="mb-2 bg-shekinah text-white">{t(item.dayKey)}</Badge>
                      <h3 className="text-lg font-semibold">{t(item.titleKey)}</h3>
                    </div>
                    <time className="text-sm font-medium text-muted-foreground">{item.time}</time>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
