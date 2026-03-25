import { SignJWT, jwtVerify } from "jose";

export const WECHAT_COOKIE = "wechat_session";
const ALG = "HS256";

function getSecret() {
  const raw = process.env.WECHAT_SESSION_SECRET || "dev-secret-please-change-in-production";
  return new TextEncoder().encode(raw);
}

export interface WeChatSession {
  openId: string;
  name: string;
  avatarUrl?: string;
}

/** Sign a JWT and return the token string */
export async function signWeChatSession(data: WeChatSession): Promise<string> {
  return new SignJWT({ ...data })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

/** Verify + decode the JWT; returns null if invalid or missing */
export async function verifyWeChatSession(token: string): Promise<WeChatSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const { openId, name, avatarUrl } = payload as Record<string, unknown>;
    if (typeof openId !== "string" || typeof name !== "string") return null;
    return { openId, name, avatarUrl: avatarUrl as string | undefined };
  } catch {
    return null;
  }
}
