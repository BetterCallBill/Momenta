import { NextResponse } from "next/server";
import { signWeChatSession, WECHAT_COOKIE } from "@/lib/wechatSession";

/**
 * GET /api/auth/wechat/mock
 *
 * Development-only mock endpoint. Simulates a successful WeChat login
 * without needing real WeChat credentials. Disabled in production when
 * WECHAT_APP_ID is set.
 */
export async function GET() {
  // Safety: never allow this in production with real credentials
  if (process.env.NODE_ENV === "production" && process.env.WECHAT_APP_ID) {
    return new NextResponse("Not found", { status: 404 });
  }

  const mockSession = {
    openId: `mock_${Date.now()}`,
    name: "测试用户 (Dev)",
    avatarUrl: "",
  };

  const token = await signWeChatSession(mockSession);

  const message = JSON.stringify({
    type: "WECHAT_LOGIN_SUCCESS",
    data: {
      wechatName: mockSession.name,
      wechatOpenId: mockSession.openId,
      avatarUrl: "",
    },
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>WeChat Mock Login</title></head>
<body style="font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;background:#111;color:#ccc;gap:12px;">
  <p style="font-size:14px;margin:0;">🟢 Mock WeChat login — <strong>${mockSession.name}</strong></p>
  <p style="font-size:12px;color:#666;margin:0;">This popup only appears in development mode.</p>
  <script>
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(${message}, window.location.origin);
      }
    } catch (e) {}
    setTimeout(() => window.close(), 800);
  </script>
</body>
</html>`;

  const res = new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });

  res.cookies.set(WECHAT_COOKIE, token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return res;
}
