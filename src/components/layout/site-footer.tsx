"use client";

import { useLanguage } from "@/components/providers/language-provider";

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="page-bg-footer text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-center text-xs tracking-wide text-white/70">
          © {new Date().getFullYear()} Iglesia Bautista Shekinah. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
