"use client";

import { useEffect, useRef, useState } from "react";

export default function HomeContactForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-20 md:py-28"
    >
      <div className="mx-auto max-w-2xl px-6">
        <div className={`transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
            Get in Touch
          </p>
          <h2 className="mt-3 text-center text-3xl font-bold dark:text-brand-white text-brand-black md:text-4xl">
            Contact Us
          </h2>
          <p className="mt-3 text-center text-sm dark:text-brand-white/50 text-neutral-500">
            Questions, partnerships, or event ideas — we&apos;d love to hear from you.
          </p>
        </div>

        <div
          className={`mt-10 transition-all duration-500 delay-100 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          {status === "success" ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
                <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold dark:text-brand-white text-brand-black">
                Message Sent!
              </h3>
              <p className="mt-2 text-sm dark:text-brand-white/60 text-neutral-500">
                Thanks for reaching out. We&apos;ll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="home-name"
                    className="block text-xs font-medium uppercase tracking-wider dark:text-brand-white/60 text-neutral-500"
                  >
                    Name *
                  </label>
                  <input
                    id="home-name"
                    name="name"
                    required
                    className="mt-1.5 w-full rounded-[8px] border dark:border-neutral-700 border-neutral-300 dark:bg-neutral-800/50 bg-white/50 px-3.5 py-2.5 text-sm dark:text-brand-white text-brand-black placeholder:dark:text-brand-white/25 placeholder:text-neutral-400 focus:border-gold-500 focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="home-email"
                    className="block text-xs font-medium uppercase tracking-wider dark:text-brand-white/60 text-neutral-500"
                  >
                    Email *
                  </label>
                  <input
                    id="home-email"
                    name="email"
                    type="email"
                    required
                    className="mt-1.5 w-full rounded-[8px] border dark:border-neutral-700 border-neutral-300 dark:bg-neutral-800/50 bg-white/50 px-3.5 py-2.5 text-sm dark:text-brand-white text-brand-black placeholder:dark:text-brand-white/25 placeholder:text-neutral-400 focus:border-gold-500 focus:outline-none transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="home-phone"
                  className="block text-xs font-medium uppercase tracking-wider dark:text-brand-white/60 text-neutral-500"
                >
                  Phone <span className="normal-case text-brand-white/30">(optional)</span>
                </label>
                <input
                  id="home-phone"
                  name="phone"
                  type="tel"
                  className="mt-1.5 w-full rounded-[8px] border dark:border-neutral-700 border-neutral-300 dark:bg-neutral-800/50 bg-white/50 px-3.5 py-2.5 text-sm dark:text-brand-white text-brand-black placeholder:dark:text-brand-white/25 placeholder:text-neutral-400 focus:border-gold-500 focus:outline-none transition-colors"
                  placeholder="+61 4XX XXX XXX"
                />
              </div>

              <div>
                <label
                  htmlFor="home-message"
                  className="block text-xs font-medium uppercase tracking-wider dark:text-brand-white/60 text-neutral-500"
                >
                  Message *
                </label>
                <textarea
                  id="home-message"
                  name="message"
                  required
                  rows={4}
                  className="mt-1.5 w-full rounded-[8px] border dark:border-neutral-700 border-neutral-300 dark:bg-neutral-800/50 bg-white/50 px-3.5 py-2.5 text-sm dark:text-brand-white text-brand-black placeholder:dark:text-brand-white/25 placeholder:text-neutral-400 focus:border-gold-500 focus:outline-none transition-colors resize-none"
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
                className="btn-premium w-full rounded-full py-3 text-sm disabled:opacity-50"
              >
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
