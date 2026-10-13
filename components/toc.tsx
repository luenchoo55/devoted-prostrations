"use client";

import { useEffect, useRef, useState } from "react";
import { activeSteps, STEP_LABELS } from "@/lib/ritual";
import { useRitual } from "@/lib/stores";

const NUMERALS = "一二三四五六七八九十";
const SUTRAS: [string, string][] = [
  ["sutra-diamond", "金剛經"],
  ["sutra-pumen", "普門品"],
  ["sutra-dabei", "大悲咒"],
  ["sutra-b88", "八十八佛大懺悔文"],
];

// 右下角的目錄按鈕：點開列出各步驟，點一項就捲過去
export function Toc() {
  const [open, setOpen] = useState(false);
  const { done, offering } = useRitual();
  const steps = activeSteps(offering);
  const current = steps.find((id) => !done.includes(id));
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const item = "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-gold-soft/60";

  return (
    <div ref={box} className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-20 flex flex-col items-end gap-3">
      {open && (
        <nav
          aria-label="目錄"
          className="max-h-[calc(100dvh-6rem)] w-64 overflow-y-auto rounded-2xl border border-gold bg-paper p-2 shadow-[0_0.5rem_2rem_rgba(20,14,10,.18)]"
        >
          <div className="flex items-center justify-between px-2 pt-1 pb-2">
            <span className="font-display text-lg font-bold">目錄</span>
            <span className="text-xs text-muted tabular-nums">
              {steps.filter((id) => done.includes(id)).length} / {steps.length}
            </span>
          </div>
          <button type="button" className={`${item} text-sm text-muted`} onClick={() => go("bgm")}>
            <span className="w-6 text-center" aria-hidden>♪</span>背景音樂
          </button>
          <ol>
            {steps.map((id, i) => {
              const d = done.includes(id);
              return (
                <li key={id}>
                  <button
                    type="button"
                    className={`${item} ${id === current ? "bg-gold-soft/60" : ""}`}
                    aria-current={id === current ? "step" : undefined}
                    onClick={() => go(`step-${id}`)}
                  >
                    <span
                      className={`grid size-6 flex-none place-items-center rounded-md border-[0.09375rem] border-kasaya font-display text-[0.8125rem] font-bold ${
                        d ? "bg-kasaya text-paper" : "text-kasaya"
                      }`}
                    >
                      {NUMERALS[i]}
                    </span>
                    <span className={`min-w-0 flex-1 truncate ${d ? "text-muted line-through decoration-muted/50" : ""}`}>{STEP_LABELS[id]}</span>
                    {d && <span className="text-xs text-done">✓</span>}
                  </button>
                  {id === "sutras" && (
                    <ul className="mb-1 ml-[1.375rem] border-l border-line pl-2">
                      {SUTRAS.map(([sid, label]) => (
                        <li key={sid}>
                          <button type="button" className={`${item} py-1 text-sm text-muted`} onClick={() => go(sid)}>
                            {label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ol>
          <button type="button" className={`${item} text-sm text-muted`} onClick={() => go("eclipse")}>
            <span className="w-6 text-center" aria-hidden>◐</span>月食修持
          </button>
        </nav>
      )}

      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "關閉目錄" : "打開目錄"}
        onClick={() => setOpen(!open)}
        className="grid size-12 cursor-pointer place-items-center rounded-full bg-kasaya text-paper shadow-[0_0.25rem_1rem_rgba(20,14,10,.25)] transition-transform hover:scale-105 active:scale-95"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M9 6h11M9 12h11M9 18h11" />
            <circle cx="4.5" cy="6" r="1" fill="currentColor" />
            <circle cx="4.5" cy="12" r="1" fill="currentColor" />
            <circle cx="4.5" cy="18" r="1" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  );
}
