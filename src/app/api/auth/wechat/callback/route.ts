import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForUserInfo } from "@/lib/wechat";
import { signWeChatSession, WECHAT_COOKIE } from "@/lib/wechatSession";

/**
 * GET /api/auth/wechat/callback?code=xxx&state=xxx
 *
 * WeChat redirects here after the user scans the QR code and authorises.
 * We exchange the code for user info, issue a signed JWT cookie, then
 * post a message back to the opener window and close the popup.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return htmlResponse(popupHtml({ error: "Missing WeChat auth code" }));
  }

  try {
    const userInfo = await exchangeCodeForUserInfo(code);

    const session = {
      openId: userInfo.openid,
      name: userInfo.nickname,
      avatarUrl: userInfo.headimgurl || undefined,
    };

    const token = await signWeChatSession(session);

    const res = htmlResponse(
      popupHtml({
        payload: {
          wechatName: userInfo.nickname,
          wechatOpenId: userInfo.openid,
          avatarUrl: userInfo.headimgurl || "",
        },
      })
    );

    // httpOnly cookie for server-side authentication
    res.cookies.set(WECHAT_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("[WeChat callback]", err);
    return htmlResponse(popupHtml({ error: "WeChat login failed. Please try again." }));
  }
}

// ── helpers ──────────────────────────────────────────────────────────────────

function htmlResponse(html: string) {
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function popupHtml({
  payload,
  error,
}: {
  payload?: { wechatName: string; wechatOpenId: string; avatarUrl: string };
  error?: string;
}) {
  const message = payload
    ? JSON.stringify({ type: "WECHAT_LOGIN_SUCCESS", data: payload })
    : JSON.stringify({ type: "WECHAT_LOGIN_ERROR", error });

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>WeChat Login</title></head>
<body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#111;color:#ccc;">
  <p>${error ? "⚠️ " + error : "✓ Login successful. Closing…"}</p>
  <script>
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(${message}, window.location.origin);
      }
    } catch (e) {}
    setTimeout(() => window.close(), 500);
  </script>
</body>
</html>`;
}
