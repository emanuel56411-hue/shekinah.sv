"use client";

import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section id="inicio" className="relative min-h-[92vh] overflow-hidden bg-shekinah-950">
      <Image
        src="/assets/fotos/congregacion-culto.webp"
        alt="Congregación en Iglesia Bautista Shekinah"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/75 via-black/60 to-black/85" />

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-6xl flex-col items-center justify-center px-4 py-20 text-center text-white sm:px-6">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/85">
          San Juan Opico, El Salvador
        </p>
        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Iglesia Bautista Shekinah
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90 sm:text-xl">{t("hero.description")}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#reuniones"
            className={cn(
              buttonVariants({ size: "lg" }),
              "min-w-[160px] bg-shekinah text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-shekinah-700"
            )}
          >
            {t("hero.ctaPrimary")}
          </Link>
          <a
            href={buildWhatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "min-w-[160px] border-white/50 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
            )}
          >
            {t("hero.ctaWhatsapp")}
          </a>
        </div>

        <Card className="mt-14 w-full max-w-md border-white/20 bg-white/10 text-left text-white shadow-2xl backdrop-blur-md">
          <CardContent className="space-y-3 p-6">
            <p className="text-sm font-medium text-white/80">{t("heroPanel.welcome")}</p>
            <div>
              <p className="text-2xl font-bold">{t("common.sunday")}</p>
              <p className="text-white/90">{t("common.sundayTimes")}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-white/20 pt-3 text-sm">
              <div>
                <p className="text-white/70">{t("common.tuesday")}</p>
                <p className="font-medium">{t("schedule.tuesdayActivity")}</p>
              </div>
              <div>
                <p className="text-white/70">{t("common.thursday")}</p>
                <p className="font-medium">{t("schedule.thursdayActivity")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
