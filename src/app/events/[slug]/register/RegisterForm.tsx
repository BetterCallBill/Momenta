"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { readWeChatSession, type WeChatData } from "@/components/WeChatLoginButton";
import { AGE_RANGE_OPTIONS, SPORT_LABELS, type SportTypeValue } from "@/lib/types";

interface RegisterFormProps {
  eventId: string;
  priceCents: number;
}

// ── Field component helpers ────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-brand-white/70">
      {children}
      {required && <span className="ml-0.5 text-gold-500">*</span>}
    </label>
  );
}

const inputCls =
  "mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-sm text-brand-white placeholder:text-brand-white/30 focus:border-gold-500 focus:outline-none";

// ── Main component ─────────────────────────────────────────────────────────────

export default function RegisterForm({ eventId, priceCents }: RegisterFormProps) {
  const { t } = useLanguage();
  const isPaid = priceCents > 0;

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [wechat, setWechat] = useState<WeChatData | null>(null);
  const [waiverAgreed, setWaiverAgreed] = useState(false);
  const [interestedTypes, setInterestedTypes] = useState<SportTypeValue[]>([]);
  const waiverRef = useRef<HTMLDivElement>(null);

  // Pre-fill WeChat data from sessionStorage
  useEffect(() => {
    setWechat(readWeChatSession());

    // Also react to live login events from the header button
    function onWeChatChange(e: Event) {
      setWechat((e as CustomEvent<WeChatData | null>).detail);
    }
    window.addEventListener("wechat:change", onWeChatChange);
    return () => window.removeEventListener("wechat:change", onWeChatChange);
  }, []);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!waiverAgreed) return;

    setStatus("loading");
    setErrorMsg("");

    const form = new FormData(e.currentTarget);

    const body = {
      eventId,
      name: (form.get("name") as string).trim(),
      ageRange: form.get("ageRange") as string,
      email: (form.get("email") as string).trim().toLowerCase(),
      phone: (form.get("phone") as string).trim(),
      gender: form.get("gender") as string,
      interestedEventTypes: interestedTypes,
      wechatName: wechat?.wechatName ?? (form.get("wechatName") as string | null) ?? undefined,
      wechatOpenId: wechat?.wechatOpenId ?? undefined,
      notes: (form.get("notes") as string).trim() || undefined,
    };

    try {
      if (isPaid) {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Failed to start checkout");
        }
        const { checkoutUrl } = await res.json();
        window.location.href = checkoutUrl;
        // keep loading state during redirect
      } else {
        const res = await fetch("/api/registrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Registration failed");
        setStatus("success");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : t.register.error_generic);
      setStatus("error");
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="mt-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold">{t.register.success_title}</h3>
        <p className="mt-2 text-sm text-brand-white/60">{t.register.success_body}</p>
      </div>
    );
  }

  const buttonLabel =
    status === "loading"
      ? isPaid
        ? "Redirecting to payment…"
        : t.register.submitting
      : isPaid
      ? `Pay $${(priceCents / 100).toFixed(2)}`
      : t.register.submit;

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-5" noValidate>
      {/* WeChat banner */}
      {wechat ? (
        <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/5 px-3 py-2.5">
          <span className="text-green-400 text-base">✓</span>
          <span className="text-sm text-green-400/90">
            {t.wechat.logged_in_as}{" "}
            <strong>{wechat.wechatName}</strong>
          </span>
        </div>
      ) : (
        <div className="rounded-lg border border-neutral-700 bg-neutral-800/50 px-3 py-2.5 text-sm text-brand-white/50">
          {t.wechat.login_to_register}
        </div>
      )}

      {/* ── WeChat Name (editable if not auto-filled) ───────────────── */}
      <div>
        <Label>{t.register.wechat_name}</Label>
        {wechat ? (
          <>
            <input type="hidden" name="wechatName" value={wechat.wechatName} />
            <div className={`${inputCls} flex items-center justify-between opacity-70`}>
              <span>{wechat.wechatName}</span>
              <span className="text-xs text-gold-500">{t.register.wechat_prefilled}</span>
            </div>
          </>
        ) : (
          <input
            name="wechatName"
            className={inputCls}
            placeholder={t.register.wechat_name_placeholder}
          />
        )}
      </div>

      {/* ── Name + Age Range (two-column) ──────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <Label required>{t.register.name}</Label>
          <input
            name="name"
            required
            className={inputCls}
            placeholder={t.register.name_placeholder}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Label required>{t.register.age_range}</Label>
          <select name="ageRange" required defaultValue="" className={inputCls}>
            <option value="" disabled>{t.register.age_range_placeholder}</option>
            {AGE_RANGE_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Email ───────────────────────────────────────────────────── */}
      <div>
        <Label required>{t.register.email}</Label>
        <input
          name="email"
          type="email"
          required
          className={inputCls}
          placeholder={t.register.email_placeholder}
        />
      </div>

      {/* ── Phone ───────────────────────────────────────────────────── */}
      <div>
        <Label required>{t.register.phone}</Label>
        <input
          name="phone"
          type="tel"
          required
          className={inputCls}
          placeholder={t.register.phone_placeholder}
        />
      </div>

      {/* ── Gender ──────────────────────────────────────────────────── */}
      <div>
        <Label required>{t.register.gender}</Label>
        <select name="gender" required defaultValue="" className={inputCls}>
          <option value="" disabled>
            — select —
          </option>
          <option value="male">{t.register.gender_male}</option>
          <option value="female">{t.register.gender_female}</option>
          <option value="other">{t.register.gender_other}</option>
          <option value="prefer_not">{t.register.gender_prefer_not}</option>
        </select>
      </div>

      {/* ── Interested Event Types ──────────────────────────────────── */}
      <div>
        <Label>{t.register.interested_event_types}</Label>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {(Object.entries(SPORT_LABELS) as [SportTypeValue, string][]).map(([value, label]) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm transition-colors hover:border-gold-500/50"
            >
              <input
                type="checkbox"
                value={value}
                checked={interestedTypes.includes(value)}
                onChange={(e) =>
                  setInterestedTypes((prev) =>
                    e.target.checked
                      ? [...prev, value]
                      : prev.filter((v) => v !== value)
                  )
                }
                className="h-4 w-4 shrink-0 cursor-pointer accent-gold-500"
              />
              <span className="text-brand-white/80">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Notes ───────────────────────────────────────────────────── */}
      <div>
        <Label>{t.register.notes}</Label>
        <textarea
          name="notes"
          rows={2}
          className={inputCls}
          placeholder={t.register.notes_placeholder}
        />
      </div>

      {/* ── Waiver ──────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-gold-500">
          {t.waiver.title}
        </h3>

        {/* Scrollable waiver body */}
        <div
          ref={waiverRef}
          className="h-48 overflow-y-auto rounded-lg border border-neutral-700 bg-neutral-800/60 p-4 text-xs leading-relaxed text-brand-white/60 whitespace-pre-line scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-transparent"
        >
          {t.waiver.content}
        </div>

        {/* Agree checkbox */}
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={waiverAgreed}
            onChange={(e) => setWaiverAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-gold-500"
          />
          <span className="text-sm text-brand-white/80">{t.waiver.agree_label}</span>
        </label>
      </div>

      {isPaid && status === "idle" && (
        <p className="text-xs text-brand-white/40">
          You&apos;ll be redirected to Stripe to complete payment securely.
        </p>
      )}

      {status === "error" && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2.5 text-sm text-red-400">{errorMsg}</p>
      )}

      <p className="text-xs text-brand-white/30">{t.register.required}</p>

      <button
        type="submit"
        disabled={status === "loading" || !waiverAgreed}
        title={!waiverAgreed ? t.waiver.agree_label : undefined}
        className="w-full rounded-full bg-gold-500 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
