"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section id="inicio" className="section-surface relative min-h-[92vh]">
      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-6xl flex-col items-center justify-center px-4 py-20 text-center text-[#f5f5f5] sm:px-6">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#f5f5f5]/95">
          San Juan Opico, El Salvador
        </p>
        <h1 className="max-w-4xl text-[#f5f5f5]">
          Iglesia Bautista Shekinah
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[#f5f5f5]/95 sm:text-xl">
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
