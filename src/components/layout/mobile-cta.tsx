"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { buildWhatsappUrl } from "@/lib/whatsapp";

export function MobileCta() {
  const { t } = useLanguage();

  return (
    <nav
      aria-label={t("mobileCta.aria")}
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-white/15 bg-black/80 shadow-[0_-4px_16px_-4px_rgba(0,0,0,0.45)] backdrop-blur-md md:hidden"
    >
      <Link
        href="#reuniones"
        className="px-3 py-3.5 text-center text-sm font-semibold text-[#f5f5f5] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-shekinah"
      >
        {t("mobileCta.schedule")}
      </Link>
      <Link
        href="#ubicacion"
        className="border-x border-white/10 px-3 py-3.5 text-center text-sm font-semibold text-[#f5f5f5] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-shekinah"
      >
        {t("mobileCta.directions")}
      </Link>
      <a
        href={buildWhatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-3.5 text-center text-sm font-semibold text-[#f5f5f5] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-shekinah"
      >
        {t("mobileCta.whatsapp")}
      </a>
    </nav>
  );
}
