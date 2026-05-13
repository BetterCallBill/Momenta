import { NextResponse } from "next/server";
import { getWeChatOAuthUrl } from "@/lib/wechat";
import crypto from "crypto";

/**
 * GET /api/auth/wechat/start
 *
 * Returns the WeChat OAuth URL to open in a popup.
 * In dev mode (no WECHAT_APP_ID set), returns the mock endpoint URL instead.
 */
export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  // Dev / staging fallback — no WeChat credentials needed
  if (!process.env.WECHAT_APP_ID || !process.env.WECHAT_APP_SECRET) {
    return NextResponse.json({
      url: `${siteUrl}/api/auth/wechat/mock`,
      mock: true,
    });
  }

  const state = crypto.randomBytes(16).toString("hex");
  const redirectUri = `${siteUrl}/api/auth/wechat/callback`;
  const url = getWeChatOAuthUrl(redirectUri, state);

  return NextResponse.json({ url, mock: false });
}
