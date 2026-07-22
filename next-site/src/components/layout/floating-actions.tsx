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
      className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all hover:scale-105 hover:bg-green-600 md:bottom-6"
    >
      <MessageCircle className="h-7 w-7" />
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
      className="fixed bottom-36 right-4 z-40 rounded-full bg-background shadow-lg md:bottom-24"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
