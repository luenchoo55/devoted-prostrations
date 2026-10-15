// 進站密碼：密碼本身放在環境變數 SITE_PASSWORD，cookie 只存它的雜湊
export const AUTH_COOKIE = "tmg-auth";

export async function passwordHash(password: string) {
  const data = new TextEncoder().encode(`tmg:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}
