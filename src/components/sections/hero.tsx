"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock3 } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { getUpcomingServices } from "@/lib/schedule";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

const ctaBase =
  "inline-flex h-12 w-full min-w-[190px] items-center justify-center gap-2.5 rounded-[12px] px-8 font-sans text-[0.95rem] font-semibold transition-all duration-200 ease-out sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40";

export function Hero() {
  const { t } = useLanguage();
  const [nextLabel, setNextLabel] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => {
      const [next] = getUpcomingServices(new Date(), 1);
      if (!next) {
        setNextLabel(null);
        return;
      }
      const day = t(next.dayKey);
      setNextLabel(
        next.isLive
          ? `${t("heroPanel.live")} · ${next.timeLabel}`
          : `${t("hero.nextChip")} ${day} ${next.timeLabel}`
      );
    };
    refresh();
    const id = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(id);
  }, [t]);

  return (
    <section id="inicio" className="section-surface relative min-h-[88vh] sm:min-h-[92vh]">
      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-6xl flex-col items-center justify-center px-4 py-24 text-center sm:min-h-[92vh] sm:px-6">
        <div className="hero-copy-veil w-full max-w-3xl px-4 py-8 sm:px-8 sm:py-10">
          <h1 className="font-heading text-[2.35rem] font-semibold leading-[1.12] tracking-tight text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.75),0_8px_28px_rgba(0,0,0,0.55)] sm:text-[3.1rem] md:text-[3.4rem]">
            {t("hero.title")}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8),0_4px_16px_rgba(0,0,0,0.45)] sm:mt-6 sm:text-xl">
            {t("hero.description")}
          </p>

          {nextLabel ? (
            <p className="mx-auto mt-6 inline-flex items-center rounded-[12px] border border-white/20 bg-black/45 px-3.5 py-1.5 text-[0.78rem] font-medium text-white shadow-[0_4px_16px_-8px_rgba(0,0,0,0.55)] backdrop-blur-sm">
              {nextLabel}
            </p>
          ) : null}

          <div className="mt-8 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:mx-auto sm:mt-9 sm:max-w-none sm:flex-row sm:items-center sm:gap-3.5">
            <Link
              href="#reuniones"
              className={cn(
                ctaBase,
                "bg-gradient-to-b from-[#7a1f2e] to-[#5a1220] text-white shadow-[0_8px_20px_-6px_rgba(0,0,0,0.55)]",
                "hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-8px_rgba(0,0,0,0.6)] active:translate-y-0"
              )}
            >
              <Clock3 className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
              {t("hero.ctaPrimary")}
            </Link>
            <a
              href={buildWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                ctaBase,
                "border border-white/55 bg-white/10 text-white backdrop-blur-sm",
                "hover:-translate-y-0.5 hover:border-white/80 hover:bg-white/16 active:translate-y-0"
              )}
            >
              <WhatsappIcon className="h-[1.05rem] w-[1.05rem] shrink-0 text-[#25D366]" />
              {t("hero.ctaWhatsapp")}
            </a>
          </div>
        </div>

        <p className="mt-8 max-w-lg text-sm leading-relaxed text-white/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.65)] sm:mt-10">
          {t("anniversary.text")}
        </p>
      </div>
    </section>
  );
}
