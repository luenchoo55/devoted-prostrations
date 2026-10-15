import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, passwordHash } from "@/lib/auth";

// 沒有正確的進站 cookie 就導到 /login；沒設定 SITE_PASSWORD 時一律擋下
export async function proxy(request: NextRequest) {
  const password = process.env.SITE_PASSWORD;
  const cookie = request.cookies.get(AUTH_COOKIE)?.value;
  if (password && cookie === (await passwordHash(password))) return NextResponse.next();
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!login|robots.txt|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png).*)"],
};
