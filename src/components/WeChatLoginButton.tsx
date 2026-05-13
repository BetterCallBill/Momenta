"use client";

import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";

export interface WeChatData {
  wechatName: string;
  wechatOpenId: string;
  avatarUrl?: string;
}

const SESSION_KEY = "wechat_session";

/** Read WeChat data stored by the popup callback */
export function readWeChatSession(): WeChatData | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as WeChatData) : null;
  } catch {
    return null;
  }
}

/** Emit a custom event so other components on the page can react */
function dispatchWeChatChange(data: WeChatData | null) {
  window.dispatchEvent(new CustomEvent("wechat:change", { detail: data }));
}

// ── WeChat SVG icon ────────────────────────────────────────────────────────────
function WeChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.063-6.122zm-3.726 3.39c.532 0 .964.441.964.983a.963.963 0 0 1-.964.985.96.96 0 0 1-.959-.985c0-.542.43-.983.96-.983zm5.912 0c.533 0 .964.441.964.983a.963.963 0 0 1-.964.985.96.96 0 0 1-.959-.985c0-.542.43-.983.96-.983z" />
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function WeChatLoginButton() {
  const { t } = useLanguage();
  const [session, setSession] = useState<WeChatData | null>(null);
  const [loading, setLoading] = useState(false);

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    setSession(readWeChatSession());
  }, []);

  // Listen for updates from other components (e.g. RegisterForm logout)
  useEffect(() => {
    function onWeChatChange(e: Event) {
      setSession((e as CustomEvent<WeChatData | null>).detail);
    }
    window.addEventListener("wechat:change", onWeChatChange);
    return () => window.removeEventListener("wechat:change", onWeChatChange);
  }, []);

  // Handle postMessage from the OAuth popup
  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.origin !== window.location.origin) return;

    if (event.data?.type === "WECHAT_LOGIN_SUCCESS") {
      const data = event.data.data as WeChatData;
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
      } catch {}
      setSession(data);
      dispatchWeChatChange(data);
      setLoading(false);
    } else if (event.data?.type === "WECHAT_LOGIN_ERROR") {
      console.warn("[WeChat] login error:", event.data.error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  async function handleLogin() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/wechat/start");
      const { url } = (await res.json()) as { url: string };

      const popup = window.open(
        url,
        "wechat_login",
        "width=500,height=620,scrollbars=yes,resizable=yes"
      );

      if (!popup) {
        // Popup was blocked — fall back to full redirect
        window.location.href = url;
        return;
      }

      // Detect popup closed without sending message
      const timer = setInterval(() => {
        if (popup.closed) {
          clearInterval(timer);
          setLoading(false);
        }
      }, 500);
    } catch {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {}
    setSession(null);
    dispatchWeChatChange(null);
    await fetch("/api/auth/wechat/logout", { method: "POST" });
  }

  // ── Logged-in state ──────────────────────────────────────────────────────────
  if (session) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-neutral-700 px-3 py-1.5">
        <WeChatIcon className="h-4 w-4 text-green-400 shrink-0" />
        <span className="max-w-[120px] truncate text-sm font-medium dark:text-brand-white/90 text-neutral-700">
          {session.wechatName}
        </span>
        <button
          onClick={handleLogout}
          className="text-xs text-neutral-500 hover:text-red-400 transition-colors shrink-0"
          aria-label={t.wechat.logout}
        >
          ✕
        </button>
      </div>
    );
  }

  // ── Logged-out state ─────────────────────────────────────────────────────────
  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="btn-premium flex items-center gap-2 rounded-full px-5 py-2 text-sm disabled:opacity-60"
    >
      <WeChatIcon className="h-4 w-4 shrink-0" />
      <span>{loading ? t.wechat.logging_in : t.wechat.login_button}</span>
    </button>
  );
}
