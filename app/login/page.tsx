"use client";

import { useActionState } from "react";
import { KowtowSeal } from "@/components/kowtow-seal";
import { login } from "./actions";

export default function LoginPage() {
  const [error, action, pending] = useActionState(login, null);

  return (
    <main className="grid min-h-dvh place-items-center p-4">
      <form
        action={action}
        className="grid w-full max-w-[22rem] gap-4 rounded-[1.125rem] border border-gold bg-paper px-6 pt-7 pb-6 text-center"
      >
        <div className="flex items-center justify-center gap-3">
          <h1 className="font-display text-xl font-bold text-kasaya">在天滿宮虔誠磕頭</h1>
          <KowtowSeal />
        </div>
        <label className="grid gap-2 text-sm text-muted">
          請輸入密碼
          <input
            type="password"
            name="password"
            inputMode="numeric"
            autoComplete="current-password"
            autoFocus
            required
            className="rounded-lg border border-gold bg-transparent px-3 py-2 text-center text-base tracking-widest text-ink outline-none focus:border-kasaya"
          />
        </label>
        {error && <p className="text-sm text-kasaya">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer rounded-full bg-kasaya px-5 py-2 text-paper transition-opacity disabled:opacity-60"
        >
          {pending ? "確認中…" : "進入"}
        </button>
      </form>
    </main>
  );
}
