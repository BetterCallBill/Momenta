"use client";

import { useLanguage } from "./LanguageContext";

export default function ContactInfoPanel() {
  const { t } = useLanguage();

  return (
    <div>
      <h1 className="text-3xl font-bold md:text-4xl">{t.contact.page_title}</h1>
      <p className="mt-2 text-brand-white/60">{t.contact.page_subtitle}</p>

      <div className="mt-10 space-y-8">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-gold-500">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" />
            </svg>
          </span>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-500">
              {t.contact.email_label}
            </h3>
            <a
              href="mailto:momenta0429@gmail.com"
              className="mt-1 block text-brand-white/70 transition-colors hover:text-gold-400"
            >
              momenta0429@gmail.com
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-gold-500">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </span>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-500">
              {t.contact.location_label}
            </h3>
            <p className="mt-1 text-brand-white/70">{t.contact.location_value}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-gold-500">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
          </span>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-500">
              {t.contact.social_label}
            </h3>
            <div className="mt-1 flex flex-col gap-2">
              <a
                href="https://instagram.com/momenta_events_group"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-white/70 transition-colors hover:text-gold-400"
              >
                Instagram: @momenta_events_group
              </a>
              <span className="select-all text-brand-white/70">WeChat: anc1140560182</span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-gold-500">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-500">
              {t.contact.response_label}
            </h3>
            <p className="mt-1 text-sm text-brand-white/50">{t.contact.response_value}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
