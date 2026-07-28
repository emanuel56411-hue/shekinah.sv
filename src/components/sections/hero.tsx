"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import {
  getDefaultHeroServices,
  getFeaturedTimeLabel,
  getHeroServices,
  type UpcomingService,
} from "@/lib/schedule";
import { cn } from "@/lib/utils";

const HERO_POSTER = "/assets/fotos/congregacion-culto.webp";
const HERO_VIDEO_DESKTOP = "/assets/videos/hero-bg.mp4";
const HERO_VIDEO_MOBILE = "/assets/videos/hero-bg-mobile.mp4";

export function Hero() {
  const { t } = useLanguage();
  const [services, setServices] = useState<UpcomingService[]>(getDefaultHeroServices);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => setServices(getHeroServices(new Date()));
    refresh();
    const id = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const pickSource = () => {
      const mobile = window.matchMedia("(max-width: 768px)").matches;
      setVideoSrc(mobile ? HERO_VIDEO_MOBILE : HERO_VIDEO_DESKTOP);
    };

    pickSource();
    const mq = window.matchMedia("(max-width: 768px)");
    mq.addEventListener("change", pickSource);
    return () => mq.removeEventListener("change", pickSource);
  }, []);

  const [featured, ...others] = services;
  const statusKey = featured.isLive ? "heroPanel.live" : "heroPanel.next";

  return (
    <section id="inicio" className="relative min-h-[92vh] overflow-hidden bg-shekinah-950">
      <Image
        src={HERO_POSTER}
        alt="Congregación en Iglesia Bautista Shekinah"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      {videoSrc ? (
        <video
          key={videoSrc}
          className="absolute inset-0 h-full w-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={HERO_POSTER}
          aria-hidden
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : null}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/80 via-black/70 to-black/90" />

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-6xl flex-col items-center justify-center px-4 py-20 text-center text-white sm:px-6">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/90">
          San Juan Opico, El Salvador
        </p>
        <h1 className="max-w-4xl text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.75)]">
          Iglesia Bautista Shekinah
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/95 sm:text-xl">{t("hero.description")}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#reuniones"
            className={cn(
              buttonVariants({ size: "lg" }),
              "min-w-[160px] bg-shekinah text-white shadow-lg transition-all hover:bg-shekinah-700 focus-visible:ring-2 focus-visible:ring-white"
            )}
          >
            {t("hero.ctaPrimary")}
          </Link>
          <a
            href={buildWhatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "min-w-[160px] bg-green-600 text-white shadow-lg transition-all hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-white"
            )}
          >
            {t("hero.ctaWhatsapp")}
          </a>
        </div>

        <Card
          className="mt-14 w-full max-w-md border-white/20 bg-white/10 text-left text-white shadow-2xl backdrop-blur-md"
          aria-label={t("heroPanel.aria")}
        >
          <CardContent className="space-y-3 p-6">
            <p className="text-sm font-medium text-white/80">{t(statusKey)}</p>
            <div>
              <p className="text-2xl font-bold">{t(featured.dayKey)}</p>
              <p className="text-white/90">{getFeaturedTimeLabel(featured)}</p>
              {featured.id !== "sunday1" || featured.isLive ? (
                <p className="mt-1 text-sm text-white/70">{t(featured.titleKey)}</p>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-white/20 pt-3 text-sm">
              {others.map((item) => (
                <div key={`${item.id}-${item.sortKey}`}>
                  <p className="text-white/70">{t(item.dayKey)}</p>
                  <p className="font-medium">{t(item.titleKey)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
