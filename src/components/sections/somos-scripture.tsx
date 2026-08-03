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
          <p className="font-heading text-[1.5rem] font-medium leading-snug tracking-tight text-balance text-white sm:text-[1.85rem] md:text-[2.05rem] md:leading-[1.35]">
            “{t("scripture.verseText")}”
          </p>
          <cite className="mt-7 block font-sans text-sm font-medium not-italic text-[#f3c4cb]">
            {t("scripture.verseRef")}
          </cite>
        </blockquote>
      </Reveal>
    </section>
  );
}
