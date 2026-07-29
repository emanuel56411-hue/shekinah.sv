"use client";

import { useEffect, useRef, useState } from "react";
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

const HERO_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

const FADE_DURATION = 0.5;

export function Hero() {
  const { t } = useLanguage();
  const [services, setServices] = useState<UpcomingService[]>(getDefaultHeroServices);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOpacity, setVideoOpacity] = useState(0);

  useEffect(() => {
    const refresh = () => setServices(getHeroServices(new Date()));
    refresh();
    const id = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId = 0;
    let restartTimer: number | undefined;

    const updateFade = () => {
      const duration = video.duration;
      const current = video.currentTime;

      if (!Number.isFinite(duration) || duration <= 0) {
        rafId = requestAnimationFrame(updateFade);
        return;
      }

      let nextOpacity = 1;
      if (current < FADE_DURATION) {
        nextOpacity = Math.max(0, current / FADE_DURATION);
      } else if (current > duration - FADE_DURATION) {
        nextOpacity = Math.max(0, (duration - current) / FADE_DURATION);
      }

      setVideoOpacity(nextOpacity);
      rafId = requestAnimationFrame(updateFade);
    };

    const handleEnded = () => {
      setVideoOpacity(0);
      restartTimer = window.setTimeout(() => {
        video.currentTime = 0;
        void video.play().catch(() => undefined);
      }, 100);
    };

    const handleCanPlay = () => {
      void video.play().catch(() => undefined);
    };

    video.addEventListener("ended", handleEnded);
    video.addEventListener("canplay", handleCanPlay);
    rafId = requestAnimationFrame(updateFade);
    void video.play().catch(() => undefined);

    return () => {
      cancelAnimationFrame(rafId);
      if (restartTimer) window.clearTimeout(restartTimer);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  const [featured, ...others] = services;
  const statusKey = featured.isLive ? "heroPanel.live" : "heroPanel.next";

  return (
    <section id="inicio" className="section-surface relative min-h-[92vh] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: videoOpacity, transition: "opacity 50ms linear" }}
          src={HERO_VIDEO_URL}
          muted
          playsInline
          preload="auto"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/75" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-6xl flex-col items-center justify-center px-4 py-20 text-center text-[#f5f5f5] sm:px-6">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#f5f5f5] drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)]">
          San Juan Opico, El Salvador
        </p>
        <h1 className="max-w-4xl text-[#f5f5f5] drop-shadow-[0_2px_18px_rgba(0,0,0,0.75)]">
          Iglesia Bautista Shekinah
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[#f5f5f5] drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] sm:text-xl">
          {t("hero.description")}
        </p>
        <div className="mt-10 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center sm:gap-4">
          <Link
            href="#reuniones"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 w-full min-w-[160px] bg-shekinah text-white shadow-lg transition-all hover:bg-shekinah-700 focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
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
              "h-11 w-full min-w-[160px] bg-green-600 text-white shadow-lg transition-all hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
            )}
          >
            {t("hero.ctaWhatsapp")}
          </a>
        </div>

        <Card
          className="mt-14 w-full max-w-md border-white/25 bg-black/55 text-left text-white shadow-2xl backdrop-blur-md"
          aria-label={t("heroPanel.aria")}
        >
          <CardContent className="space-y-3 p-6">
            <p className="text-sm font-medium text-white/90">{t(statusKey)}</p>
            <div>
              <p className="text-2xl font-bold">{t(featured.dayKey)}</p>
              <p className="text-white/95">{getFeaturedTimeLabel(featured)}</p>
              {featured.id !== "sunday1" || featured.isLive ? (
                <p className="mt-1 text-sm text-white/85">{t(featured.titleKey)}</p>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-white/25 pt-3 text-xs sm:text-sm">
              {others.map((item) => (
                <div key={`${item.id}-${item.sortKey}`} className="min-w-0">
                  <p className="text-white/80">{t(item.dayKey)}</p>
                  <p className="font-medium leading-snug text-white">{t(item.titleKey)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
