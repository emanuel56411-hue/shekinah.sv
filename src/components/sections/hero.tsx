"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section id="inicio" className="section-surface relative min-h-[88vh] sm:min-h-[92vh]">
      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-6xl flex-col items-center justify-center px-4 py-24 text-center sm:min-h-[92vh] sm:px-6">
        <p className="mb-5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/90 sm:text-sm">
          San Juan Opico, El Salvador
        </p>
        <h1 className="max-w-4xl text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)]">
          Iglesia Bautista Shekinah
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/90 sm:mt-6 sm:text-xl">
          {t("hero.description")}
        </p>
        <div className="mt-9 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:items-center sm:gap-4">
          <Link
            href="#reuniones"
            className={cn(
              buttonVariants({ size: "lg" }),
              "btn-skeuo h-12 w-full min-w-[168px] rounded-full px-6 text-[0.95rem] font-semibold focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
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
              "btn-skeuo-green h-12 w-full min-w-[168px] rounded-full px-6 text-[0.95rem] font-semibold focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
            )}
          >
            {t("hero.ctaWhatsapp")}
          </a>
        </div>
      </div>
    </section>
  );
}
