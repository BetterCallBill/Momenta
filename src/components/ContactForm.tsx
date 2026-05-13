"use client";

import { useState } from "react";
import { useLanguage } from "./LanguageContext";

const INPUT_CLASS =
  "mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-sm text-brand-white placeholder:text-brand-white/30 focus:border-gold-500 focus:outline-none";

export default function ContactForm() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = new FormData(e.currentTarget);

    if (form.get("honeypot")) {
      setStatus("success");
      return;
    }

    const body = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone") || "",
      inquiryType: form.get("inquiryType") || "General",
      message: form.get("message"),
      honeypot: form.get("honeypot") || "",
    };

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : t.contact.form_error_generic);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold">{t.contact.form_success_title}</h3>
        <p className="mt-2 text-sm text-brand-white/60">{t.contact.form_success_body}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 md:p-8"
    >
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-brand-white/70">
          {t.contact.form_name} *
        </label>
        <input
          id="contact-name"
          name="name"
          required
          className={INPUT_CLASS}
          placeholder={t.contact.form_name_placeholder}
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-brand-white/70">
          {t.contact.form_email} *
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          className={INPUT_CLASS}
          placeholder={t.contact.form_email_placeholder}
        />
      </div>

      <div>
        <label htmlFor="contact-phone" className="block text-sm font-medium text-brand-white/70">
          {t.contact.form_phone}
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          className={INPUT_CLASS}
          placeholder={t.contact.form_phone_placeholder}
        />
      </div>

      <div>
        <label htmlFor="contact-inquiry-type" className="block text-sm font-medium text-brand-white/70">
          {t.contact.form_inquiry_type} *
        </label>
        <select
          id="contact-inquiry-type"
          name="inquiryType"
          required
          className={INPUT_CLASS}
        >
          <option value="General">{t.contact.form_inquiry_general}</option>
          <option value="Event Booking">{t.contact.form_inquiry_booking}</option>
          <option value="Sponsorship">{t.contact.form_inquiry_sponsorship}</option>
          <option value="Other">{t.contact.form_inquiry_other}</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-brand-white/70">
          {t.contact.form_message} *
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className={INPUT_CLASS}
          placeholder={t.contact.form_message_placeholder}
        />
      </div>

      {/* Honeypot */}
      <input
        name="honeypot"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-2499.75 h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <p className="text-xs text-brand-white/40">{t.contact.form_required}</p>

      {status === "error" && (
        <p className="text-sm text-red-400">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-gold-500 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-gold-400 disabled:opacity-50"
      >
        {status === "loading" ? t.contact.form_submitting : t.contact.form_submit}
      </button>
    </form>
  );
}
