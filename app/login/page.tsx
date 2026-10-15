"use client";

import { useActionState, useState, useTransition } from "react";
import { KowtowSeal } from "@/components/kowtow-seal";
import { ThemeToggle } from "@/components/theme-toggle";
import { kowtowLogin, login } from "./actions";

const KOWTOW_TIMES = 108;

export default function LoginPage() {
  const [error, action, pending] = useActionState(login, null);
  const [count, setCount] = useState(0);
  const [entering, startEntering] = useTransition();

  // 磕滿 108 次直接進站
  const kowtow = () => {
    const n = count + 1;
    setCount(n);
    if (n === KOWTOW_TIMES) startEntering(() => kowtowLogin());
  };

  return (
    <main className="grid min-h-dvh place-items-center p-4">
      <div className="grid w-full max-w-[22rem] grid-cols-[minmax(0,1fr)] justify-items-center gap-5">
        <form
          action={action}
          className="grid w-full max-w-[22rem] grid-cols-[minmax(0,1fr)] gap-4 rounded-[1.125rem] border border-gold bg-paper px-6 pt-7 pb-6 text-center"
        >
          <h1 className="font-display text-xl font-bold text-kasaya">在天滿宮虔誠磕頭</h1>
          <div className="grid justify-items-center gap-2 py-2">
            <KowtowSeal large onTap={kowtow} />
            <p className="min-h-5 text-sm text-muted tabular-nums">
              {entering ? "功德圓滿，進入中…" : count > 0 ? `已磕頭 ${count} 次` : ""}
            </p>
          </div>
          <label className="grid grid-cols-[minmax(0,1fr)] gap-2 text-sm text-muted">
            請輸入密碼
            <input
              type="password"
              name="password"
              inputMode="numeric"
              autoComplete="current-password"
              autoFocus
              required
              className="w-full min-w-0 rounded-lg border border-gold bg-transparent px-3 py-2 text-center text-base tracking-widest text-ink outline-none focus:border-kasaya"
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
        <ThemeToggle />
      </div>
    </main>
  );
}
