import { NextResponse } from "next/server";
import { WECHAT_COOKIE } from "@/lib/wechatSession";

/** POST /api/auth/wechat/logout — clears the httpOnly session cookie */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(WECHAT_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return res;
}
