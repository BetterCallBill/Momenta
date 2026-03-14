"use client";

import { useLanguage } from "./LanguageContext";

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "zh" : "en")}
      className="relative flex h-9 items-center justify-center rounded-full border border-neutral-700 bg-neutral-100 dark:bg-neutral-800 px-2.5 text-xs font-semibold transition-colors duration-200 hover:border-gold-500/50 text-neutral-600 dark:text-neutral-300 gap-1"
      aria-label={locale === "en" ? "切换到中文" : "Switch to English"}
    >
      <span className={locale === "en" ? "text-gold-500" : "text-neutral-500"}>EN</span>
      <span className="text-neutral-500">/</span>
      <span className={locale === "zh" ? "text-gold-500" : "text-neutral-500"}>中</span>
    </button>
  );
}
