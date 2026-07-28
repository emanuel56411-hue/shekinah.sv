"use client";

import { ArrowUp, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { buildWhatsappUrl } from "@/lib/whatsapp";

export function FabWhatsapp() {
  const { t } = useLanguage();

  return (
    <a
      href={buildWhatsappUrl("Hola, quiero más información")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("fab.whatsappAria")}
      className="fixed bottom-[5.5rem] right-3 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah focus-visible:ring-offset-2 sm:h-14 sm:w-14 md:bottom-6 md:right-4"
    >
      <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
    </a>
  );
}

export function ScrollTop() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      aria-label={t("fab.scrollTopAria")}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-[9.25rem] right-3 z-40 rounded-full border-black/25 bg-white text-[#1a1214] shadow-lg hover:bg-[#FAF8F3] hover:text-[#65101a] focus-visible:ring-2 focus-visible:ring-shekinah md:bottom-24 md:right-4"
    >
      <ArrowUp className="h-5 w-5 text-[#1a1214]" />
    </Button>
  );
}
