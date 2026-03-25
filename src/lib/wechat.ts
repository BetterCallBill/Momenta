/**
 * WeChat Web OAuth 2.0 helpers
 *
 * Prerequisites (WeChat Open Platform — open.weixin.qq.com):
 *   1. Register an Open Platform account
 *   2. Create a "Website Application" (网站应用) and get WECHAT_APP_ID + WECHAT_APP_SECRET
 *   3. Whitelist your domain (e.g. momenta.com.au) in the app settings
 *
 * In development, set WECHAT_APP_ID="" to trigger mock mode (no real WeChat needed).
 */

const WECHAT_OPEN_BASE = "https://open.weixin.qq.com";
const WECHAT_API_BASE = "https://api.weixin.qq.com";

export interface WeChatUserInfo {
  openid: string;
  nickname: string;
  headimgurl: string;
  sex: number; // 1=male 2=female 0=unknown
}

/** Build the QR-code-based OAuth URL shown to the user */
export function getWeChatOAuthUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    appid: process.env.WECHAT_APP_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "snsapi_login",
    state,
  });
  return `${WECHAT_OPEN_BASE}/connect/qrconnect?${params}#wechat_redirect`;
}

/** Exchange an OAuth code for user info (nickname, openid, avatar) */
export async function exchangeCodeForUserInfo(code: string): Promise<WeChatUserInfo> {
  // Step 1: code → access_token + openid
  const tokenUrl = new URL(`${WECHAT_API_BASE}/sns/oauth2/access_token`);
  tokenUrl.searchParams.set("appid", process.env.WECHAT_APP_ID!);
  tokenUrl.searchParams.set("secret", process.env.WECHAT_APP_SECRET!);
  tokenUrl.searchParams.set("code", code);
  tokenUrl.searchParams.set("grant_type", "authorization_code");

  const tokenRes = await fetch(tokenUrl.toString());
  const tokenData = (await tokenRes.json()) as {
    access_token?: string;
    openid?: string;
    errcode?: number;
    errmsg?: string;
  };

  if (tokenData.errcode || !tokenData.access_token) {
    throw new Error(`WeChat token exchange failed: ${tokenData.errmsg ?? "unknown error"}`);
  }

  // Step 2: access_token + openid → user profile
  const userUrl = new URL(`${WECHAT_API_BASE}/sns/userinfo`);
  userUrl.searchParams.set("access_token", tokenData.access_token);
  userUrl.searchParams.set("openid", tokenData.openid!);
  userUrl.searchParams.set("lang", "zh_CN");

  const userRes = await fetch(userUrl.toString());
  const userData = (await userRes.json()) as WeChatUserInfo & {
    errcode?: number;
    errmsg?: string;
  };

  if (userData.errcode) {
    throw new Error(`WeChat user info failed: ${userData.errmsg ?? "unknown error"}`);
  }

  return {
    openid: userData.openid,
    nickname: userData.nickname,
    headimgurl: userData.headimgurl,
    sex: userData.sex,
  };
}
