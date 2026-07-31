"use client";

import { Reveal } from "@/components/motion/reveal";
import { useLanguage } from "@/components/providers/language-provider";

export function AnniversaryNote() {
  const { t } = useLanguage();

  return (
    <Reveal className="section-surface">
      <div
        className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center sm:flex-row sm:justify-center sm:gap-6 sm:px-6 sm:py-12 sm:text-left"
        aria-label={t("anniversary.aria")}
      >
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[#ffc9d0]/40 bg-[#65101a] sm:h-24 sm:w-24">
          <div className="text-center leading-none">
            <span className="font-heading text-4xl font-bold text-white sm:text-5xl">19</span>
            <span className="mt-1 block text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#f4f0e8]">
              {t("anniversary.years")}
            </span>
          </div>
        </div>
        <p className="max-w-xl text-base text-[#f5f5f5] drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)] sm:text-lg">
          {t("anniversary.text")}
        </p>
      </div>
    </Reveal>
  );
}
