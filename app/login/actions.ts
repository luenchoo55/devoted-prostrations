"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE, passwordHash } from "@/lib/auth";

export async function login(_prev: string | null, formData: FormData) {
  const password = process.env.SITE_PASSWORD;
  if (!password || formData.get("password") !== password) return "密碼不正確";

  (await cookies()).set(AUTH_COOKIE, await passwordHash(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  redirect("/");
}
