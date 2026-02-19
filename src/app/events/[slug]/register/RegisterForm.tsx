"use client";

import { useState } from "react";

interface RegisterFormProps {
  eventId: string;
}

export default function RegisterForm({ eventId }: RegisterFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = new FormData(e.currentTarget);
    const body = {
      eventId,
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      notes: form.get("notes") || "",
    };

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mt-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold">You&apos;re registered!</h3>
        <p className="mt-2 text-sm text-brand-white/60">
          We&apos;ll send a confirmation to your email. See you there!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label htmlFor="reg-name" className="block text-sm font-medium text-brand-white/70">
          Full Name *
        </label>
        <input
          id="reg-name"
          name="name"
          required
          className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-sm text-brand-white placeholder:text-brand-white/30 focus:border-gold-500 focus:outline-none"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="reg-email" className="block text-sm font-medium text-brand-white/70">
          Email *
        </label>
        <input
          id="reg-email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-sm text-brand-white placeholder:text-brand-white/30 focus:border-gold-500 focus:outline-none"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="reg-phone" className="block text-sm font-medium text-brand-white/70">
          Phone *
        </label>
        <input
          id="reg-phone"
          name="phone"
          type="tel"
          required
          className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-sm text-brand-white placeholder:text-brand-white/30 focus:border-gold-500 focus:outline-none"
          placeholder="04xx xxx xxx"
        />
      </div>
      <div>
        <label htmlFor="reg-notes" className="block text-sm font-medium text-brand-white/70">
          Notes
        </label>
        <textarea
          id="reg-notes"
          name="notes"
          rows={2}
          className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-sm text-brand-white placeholder:text-brand-white/30 focus:border-gold-500 focus:outline-none"
          placeholder="Any dietary requirements, experience level, etc."
        />
      </div>

      {status === "error" && <p className="text-sm text-red-400">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-gold-500 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-gold-400 disabled:opacity-50"
      >
        {status === "loading" ? "Registering..." : "Confirm Registration"}
      </button>
    </form>
  );
}
