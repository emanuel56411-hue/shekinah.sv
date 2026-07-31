"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const HERO_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

export function Hero() {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let restartTimer: number | undefined;

    const handleEnded = () => {
      restartTimer = window.setTimeout(() => {
        video.currentTime = 0;
        void video.play().catch(() => undefined);
      }, 80);
    };

    const handleCanPlay = () => {
      setVideoReady(true);
      void video.play().catch(() => undefined);
    };

    video.addEventListener("ended", handleEnded);
    video.addEventListener("canplay", handleCanPlay);
    void video.play().catch(() => undefined);

    return () => {
      if (restartTimer) window.clearTimeout(restartTimer);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  return (
    <section id="inicio" className="section-surface relative min-h-[92vh] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: videoReady ? 1 : 0 }}
          src={HERO_VIDEO_URL}
          muted
          playsInline
          preload="metadata"
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
              "btn-skeuo h-11 w-full min-w-[160px] focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
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
              "btn-skeuo-green h-11 w-full min-w-[160px] focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
            )}
          >
            {t("hero.ctaWhatsapp")}
          </a>
        </div>
      </div>
    </section>
  );
}
