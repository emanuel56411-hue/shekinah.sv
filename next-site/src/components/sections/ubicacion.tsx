"use client";

import Image from "next/image";
import { MapPin, MessageCircle, Navigation } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { LINKS } from "@/lib/constants";
import { buildWhatsappUrl } from "@/lib/whatsapp";

export function Ubicacion() {
  const { t } = useLanguage();

  const actions = [
    {
      href: LINKS.maps,
      label: t("ubicacion.mapsBtn"),
      hint: t("ubicacion.mapsHint"),
      icon: MapPin,
      className: "hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30",
    },
    {
      href: LINKS.waze,
      label: t("ubicacion.wazeBtn"),
      hint: t("ubicacion.wazeHint"),
      icon: Navigation,
      className: "hover:border-sky-200 hover:bg-sky-50 dark:hover:bg-sky-950/30",
    },
    {
      href: buildWhatsappUrl(),
      label: t("ubicacion.whatsappBtn"),
      hint: t("ubicacion.whatsappHint"),
      icon: MessageCircle,
      className: "hover:border-green-200 hover:bg-green-50 dark:hover:bg-green-950/30",
    },
  ];

  return (
    <section id="ubicacion" className="section-padding">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <p className="eyebrow">{t("ubicacion.eyebrow")}</p>
          <h2 className="section-title">{t("ubicacion.title")}</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {actions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex flex-col rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover ${action.className}`}
              >
                <action.icon className="mb-2 h-5 w-5 text-shekinah" />
                <span className="font-semibold">{action.label}</span>
                <small className="text-xs text-muted-foreground">{action.hint}</small>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Card className="overflow-hidden border-0 shadow-card-hover">
            <div className="relative aspect-[4/3]">
              <Image
                src="/assets/fotos/congregacion-culto.webp"
                alt="Congregación reunida en Iglesia Bautista Shekinah"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-sm uppercase tracking-wide text-white/75">{t("nav.ubicacion")}</p>
                <p className="text-2xl font-bold">QJRR+HH2</p>
                <p className="text-white/85">San Juan Opico, La Libertad</p>
              </CardContent>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
