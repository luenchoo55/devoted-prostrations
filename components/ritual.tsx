"use client";

import type { ReactNode } from "react";
import { activeSteps, CUNDI_MONTHS, type StepId } from "@/lib/ritual";
import { COUNTER_TIMES, tapCounter, toggleStep, useNow, useRitual, type Counter } from "@/lib/stores";
import { card, PlayLink } from "./ui";

const NUMERALS = "一二三四五六七八九十";

export function Step({ id, title, children }: { id: StepId; title: string; children?: ReactNode }) {
  const { done, offering } = useRitual();
  const index = activeSteps(offering).indexOf(id);
  if (index < 0) return null;
  const d = done.includes(id);
  return (
    <li className="group/step relative grid grid-cols-[44px_1fr] gap-3.5 pb-8">
      <span aria-hidden className="absolute top-[46px] bottom-1 left-[21px] w-0.5 bg-line group-last/step:hidden" />
      <div
        className={`grid size-11 place-items-center rounded-[10px] border-2 border-kasaya font-display text-xl font-bold transition-colors ${
          d ? "bg-kasaya text-paper" : "bg-paper text-kasaya"
        }`}
      >
        {NUMERALS[index]}
      </div>
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-2.5">
          <h2 className={`mt-1.5 mb-1 font-display text-[22px] leading-snug font-bold text-balance ${d ? "text-muted" : ""}`}>
            {title}
          </h2>
          <button
            type="button"
            aria-pressed={d}
            onClick={() => toggleStep(id)}
            className={`mt-1.5 flex-none cursor-pointer rounded-full border bg-paper px-3 py-0.5 text-[13px] ${
              d ? "border-done text-done" : "border-line text-muted"
            }`}
          >
            {d ? "已完成 ✓" : "完成"}
          </button>
        </div>
        {children}
      </div>
    </li>
  );
}

// 念誦計數：佛珠逐顆點亮，念滿自動完成
export function MantraCounter({ id, zh, lat }: { id: Counter; zh: string; lat: string }) {
  const n = useRitual().counts[id];
  const total = COUNTER_TIMES[id];
  return (
    <div className={`${card} mt-2 p-4`}>
      <p className="font-display text-[21px] leading-[1.8]">{zh}</p>
      <p className="mt-1 mb-3 text-sm text-muted italic">{lat}</p>
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => tapCounter(id)}
          className="cursor-pointer rounded-full border border-gold bg-gold-soft px-4 py-1.5 text-[15px] active:scale-95"
        >
          {n >= total ? `${NUMERALS[total - 1]}遍圓滿` : "念一遍"}
        </button>
        <div className="flex gap-[7px]" aria-hidden>
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className={`size-[18px] rounded-full border-2 border-gold transition-colors ${i < n ? "bg-gold" : ""}`} />
          ))}
        </div>
        <span className="text-sm text-muted tabular-nums">
          {n} / {total}
        </span>
      </div>
    </div>
  );
}

// 準提佛母祈禱文：依當月份
export function CundiMonths() {
  const now = useNow();
  const m = now === null ? -1 : new Date(now).getMonth();
  const current = CUNDI_MONTHS[m];
  return (
    <>
      <PlayLink href={current?.[1] ?? CUNDI_MONTHS[0][1]}>{current ? `本月 · ${current[0]}` : "本月"}</PlayLink>
      <div className="mt-2.5 grid grid-cols-4 gap-1.5 min-[421px]:grid-cols-6">
        {CUNDI_MONTHS.map(([name, url], i) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener"
            className={`rounded-lg border bg-paper py-1.5 text-center text-sm no-underline ${
              i === m ? "border-kasaya font-bold text-kasaya" : "border-line text-muted"
            }`}
          >
            {name}
          </a>
        ))}
      </div>
    </>
  );
}
