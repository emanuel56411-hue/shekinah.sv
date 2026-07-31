"use client";

import { Reveal } from "@/components/motion/reveal";
import { useLanguage } from "@/components/providers/language-provider";

export function AnniversaryNote() {
  const { t } = useLanguage();

  return (
    <Reveal className="section-surface">
      <div
        className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-12 text-center sm:flex-row sm:justify-center sm:gap-7 sm:px-6 sm:py-14 sm:text-left"
        aria-label={t("anniversary.aria")}
      >
        <div className="flex h-[5.25rem] w-[5.25rem] shrink-0 items-center justify-center rounded-full border border-white/25 bg-[#65101a] shadow-[0_10px_24px_-12px_rgba(0,0,0,0.55)] sm:h-24 sm:w-24">
          <div className="text-center leading-none">
            <span className="font-heading text-4xl font-bold text-white sm:text-5xl">19</span>
            <span className="mt-1 block text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#f7ebe8]">
              {t("anniversary.years")}
            </span>
          </div>
        </div>
        <p className="max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
          {t("anniversary.text")}
        </p>
      </div>
    </Reveal>
  );
}
