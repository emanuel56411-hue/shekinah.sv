"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const menuGroups = {
  connect: [
    { href: "#reuniones", titleKey: "nav.horarios", descKey: "menu.scheduleDesc" },
    { href: "#eventos", titleKey: "nav.eventos", descKey: "menu.eventsDesc" },
    { href: "#ministerios", titleKey: "nav.ministerios", descKey: "menu.ministriesDesc" },
    { href: "#ayuda", titleKey: "nav.ayuda", descKey: "menu.helpDesc" },
  ],
  discover: [
    { href: "#ubicacion", titleKey: "nav.ubicacion", descKey: "menu.locationDesc" },
    { href: "#redes", titleKey: "nav.redes", descKey: "menu.socialDesc" },
    { href: "#eventos", titleKey: "menu.messages", descKey: "menu.messagesDesc" },
  ],
  contact: [{ href: buildWhatsappUrl(), title: "WhatsApp", descKey: "menu.whatsappDesc", external: true }],
} as const;

export function SiteHeader() {
  const { t, lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [tab, setTab] = useState<"connect" | "discover" | "contact">("connect");
  const [open, setOpen] = useState(false);

  const tabs = [
    { id: "connect" as const, label: t("menu.connect") },
    { id: "discover" as const, label: t("menu.discover") },
    { id: "contact" as const, label: t("menu.contact") },
  ];

  const currentLinks =
    tab === "contact"
      ? menuGroups.contact
      : tab === "discover"
        ? menuGroups.discover
        : menuGroups.connect;

  return (
    <header className="fixed inset-x-0 top-0 z-[100] border-b border-border/70 bg-white/95 shadow-sm backdrop-blur-md dark:bg-background/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="#inicio" aria-label={t("header.brandAria")} className="flex items-center gap-3">
          <Image src="/assets/logo-shekinah.png" alt="Logo Shekinah" width={46} height={46} className="rounded-full" />
          <span className="leading-tight">
            <strong className="block text-sm font-bold sm:text-base">Iglesia Bautista Shekinah</strong>
            <small className="text-xs text-muted-foreground">San Juan Opico</small>
          </span>
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
            aria-label={t("menu.openAria")}
          >
            <Menu className="h-4 w-4" />
            <span className="hidden sm:inline">Menú</span>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
            <SheetHeader>
              <SheetTitle>{t("menu.title")}</SheetTitle>
            </SheetHeader>

            <div className="mt-6 flex gap-2">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    tab === item.id ? "bg-shekinah text-white" : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-3 overflow-y-auto">
              {currentLinks.map((link) => {
                const title = "titleKey" in link ? t(link.titleKey) : link.title;
                const desc = t(link.descKey);
                const external = "external" in link && link.external;

                if (external) {
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className="block rounded-xl border border-border p-4 transition-all hover:border-shekinah/30 hover:bg-muted/50"
                    >
                      <strong className="block">{title}</strong>
                      <small className="text-muted-foreground">{desc}</small>
                    </a>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl border border-border p-4 transition-all hover:border-shekinah/30 hover:bg-muted/50"
                  >
                    <strong className="block">{title}</strong>
                    <small className="text-muted-foreground">{desc}</small>
                  </Link>
                );
              })}
            </div>

            <Separator className="my-6" />

            <div className="mt-auto flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setLang(lang === "es" ? "en" : "es")}>
                {lang === "es" ? t("lang.toEnglish") : t("lang.toSpanish")}
              </Button>
              <Button variant="outline" className="flex-1" onClick={toggleTheme}>
                {theme === "dark" ? t("theme.toLight") : t("theme.toDark")}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
