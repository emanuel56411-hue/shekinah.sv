"use client";

import { Reveal } from "@/components/motion/reveal";
import { useLanguage } from "@/components/providers/language-provider";

export function Scripture() {
  const { t } = useLanguage();

  return (
    <section
      className="section-surface relative overflow-hidden py-16 sm:py-20"
      aria-label={t("scripture.aria")}
    >
      <Reveal>
        <blockquote className="relative mx-auto max-w-3xl px-6 text-center sm:px-10">
          <p className="font-heading text-[1.55rem] font-medium leading-snug tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)] sm:text-[1.85rem] md:text-[2.1rem] md:leading-[1.35]">
            “{t("scripture.verseText")}”
          </p>
          <cite className="mt-6 block font-sans text-xs font-semibold not-italic uppercase tracking-[0.22em] text-[#ffc9d0] drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
            {t("scripture.verseRef")}
          </cite>
        </blockquote>
      </Reveal>
    </section>
  );
}
