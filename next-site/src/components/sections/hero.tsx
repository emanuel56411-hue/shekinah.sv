"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section id="inicio" className="relative isolate min-h-[88vh] overflow-hidden">
      <Image
        src="/assets/fotos/congregacion-culto.webp"
        alt="Congregación en Iglesia Bautista Shekinah"
        fill
        priority
        className="-z-10 object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />

      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-6xl flex-col items-center justify-center px-4 py-24 text-center text-white sm:px-6">
        <Reveal>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
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
                "bg-shekinah shadow-lg transition-all hover:scale-[1.02] hover:bg-shekinah-900"
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
                "border-white/40 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
              )}
            >
              {t("hero.ctaWhatsapp")}
            </a>
          </div>
        </Reveal>

        <Reveal className="mt-14 w-full max-w-md" delay={0.15}>
          <Card className="border-white/15 bg-white/10 text-left text-white shadow-2xl backdrop-blur-md">
            <CardContent className="space-y-3 p-6">
              <p className="text-sm font-medium text-white/75">{t("heroPanel.welcome")}</p>
              <div>
                <p className="text-2xl font-bold">{t("common.sunday")}</p>
                <p className="text-white/85">{t("common.sundayTimes")}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 border-t border-white/15 pt-3 text-sm">
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
        </Reveal>
      </div>
    </section>
  );
}
