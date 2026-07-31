"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { buildWhatsappUrl } from "@/lib/whatsapp";

export function MobileCta() {
  const { t } = useLanguage();

  return (
    <nav
      aria-label={t("mobileCta.aria")}
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-black/10 bg-gradient-to-b from-white to-[#FAF8F3] shadow-[0_-10px_28px_-12px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-md md:hidden"
    >
      <Link
        href="#reuniones"
        className="px-3 py-3.5 text-center text-sm font-semibold text-[#1a1214] transition-colors hover:bg-[#FAF8F3] hover:text-[#65101a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-shekinah"
      >
        {t("mobileCta.schedule")}
      </Link>
      <Link
        href="#ubicacion"
        className="border-x border-black/10 px-3 py-3.5 text-center text-sm font-semibold text-[#1a1214] transition-colors hover:bg-[#FAF8F3] hover:text-[#65101a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-shekinah"
      >
        {t("mobileCta.directions")}
      </Link>
      <a
        href={buildWhatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-3.5 text-center text-sm font-semibold text-[#1a1214] transition-colors hover:bg-[#FAF8F3] hover:text-[#65101a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-shekinah"
      >
        {t("mobileCta.whatsapp")}
      </a>
    </nav>
  );
}
