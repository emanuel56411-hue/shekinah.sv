"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { type Lang, t as translate } from "@/lib/i18n";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue>({
  lang: "es",
  setLang: () => undefined,
  t: (key: string) => translate(key, "es"),
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const saved = localStorage.getItem("shekinah-lang");
    if (saved === "en" || saved === "es") {
      setLangState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    localStorage.setItem("shekinah-lang", next);
    document.documentElement.lang = next;
  };

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (key: string) => translate(key, lang),
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
