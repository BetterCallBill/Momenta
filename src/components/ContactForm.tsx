"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = new FormData(e.currentTarget);

    // Honeypot check (client-side double check)
    if (form.get("honeypot")) {
      setStatus("success");
      return;
    }

    const body = {
      name: form.get("name"),
      email: form.get("email"),
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
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
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
        <h3 className="mt-4 text-lg font-semibold">Message Sent!</h3>
        <p className="mt-2 text-sm text-brand-white/60">
          Thanks for reaching out. We&apos;ll get back to you soon.
        </p>
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
          Name *
        </label>
        <input
          id="contact-name"
          name="name"
          required
          className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-sm text-brand-white placeholder:text-brand-white/30 focus:border-gold-500 focus:outline-none"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-brand-white/70">
          Email *
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-sm text-brand-white placeholder:text-brand-white/30 focus:border-gold-500 focus:outline-none"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-brand-white/70">
          Message *
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-sm text-brand-white placeholder:text-brand-white/30 focus:border-gold-500 focus:outline-none"
          placeholder="How can we help?"
        />
      </div>

      {/* Honeypot */}
      <input
        name="honeypot"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      {status === "error" && (
        <p className="text-sm text-red-400">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-gold-500 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-gold-400 disabled:opacity-50"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
