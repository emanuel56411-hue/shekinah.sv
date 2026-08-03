"use client";

import { Reveal } from "@/components/motion/reveal";
import { SocialCards } from "@/components/social/social-panel";
import { useLanguage } from "@/components/providers/language-provider";

/** Conservada por si se vuelve a mostrar en la página. Ahora vive en el menú (SocialPanel). */
export function Redes() {
  const { t } = useLanguage();

  return (
    <section id="redes" className="section-padding section-surface-alt">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="eyebrow">{t("nav.redes")}</p>
          <h2 className="section-title">{t("redes.title")}</h2>
          <p className="section-desc">{t("redes.description")}</p>
        </Reveal>

        <div className="mt-10">
          <Reveal delay={0.06}>
            <SocialCards />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
