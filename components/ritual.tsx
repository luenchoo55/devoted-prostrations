"use client";

import { useState, type ReactNode } from "react";
import { useActiveStep } from "@/lib/active-step";
import { activeSteps, CUNDI_MONTHS, type StepId } from "@/lib/ritual";
import { COUNTER_TIMES, tapCounter, useNow, useRitual, type Counter } from "@/lib/stores";
import { card } from "./ui";
import { useVideo, VideoRow } from "./video";

const NUMERALS = "一二三四五六七八九十";

export function Step({ id, title, children }: { id: StepId; title: string; children?: ReactNode }) {
  const { done, offering } = useRitual();
  const active = useActiveStep() === id;
  const index = activeSteps(offering).indexOf(id);
  if (index < 0) return null;
  const d = done.includes(id);
  return (
    <li id={`step-${id}`} className="group/step relative grid scroll-mt-6 grid-cols-[2.75rem_1fr] gap-3.5 pb-8">
      <span aria-hidden className="absolute top-[2.875rem] bottom-1 left-[1.3125rem] w-0.5 bg-line group-last/step:hidden" />
      <div
        className={`grid size-11 place-items-center rounded-[0.625rem] border-2 border-kasaya font-display text-xl font-bold transition-colors ${
          active ? "bg-kasaya text-paper" : "bg-paper text-kasaya"
        }`}
      >
        {NUMERALS[index]}
      </div>
      <div className="min-w-0">
        <h2 className={`mt-1.5 mb-1 font-display text-[1.375rem] leading-snug font-bold text-balance ${d ? "text-muted" : ""}`}>
          {title}
        </h2>
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
      <p className="font-display text-[calc(1.3125rem*var(--scr))] leading-[1.8]">{zh}</p>
      <p className="mt-1 mb-3 text-sm text-muted italic">{lat}</p>
      <div className="mb-2.5 flex justify-center gap-2" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`size-5 rounded-full border-2 border-kasaya transition-colors ${i < n ? "bg-kasaya" : ""}`} />
        ))}
      </div>
      {/* 整塊都是按鈕，念誦時不用盯著螢幕也點得到 */}
      <button
        type="button"
        data-chant
        onClick={() => tapCounter(id)}
        className="grid w-full cursor-pointer justify-items-center gap-1 rounded-2xl border-2 border-gold bg-gold-soft px-4 py-4 transition-transform select-none [-webkit-tap-highlight-color:transparent] active:scale-[0.98]"
      >
        <span className="font-display text-xl font-bold text-kasaya">{n >= total ? `${NUMERALS[total - 1]}遍圓滿` : "念一遍"}</span>
        {n >= total && <span className="text-xs text-muted">再點一次可清空重來</span>}
      </button>
    </div>
  );
}

// 準提佛母祈禱文：預設當月，點月份可改播其他月
export function CundiMonths() {
  const now = useNow();
  const m = now === null ? -1 : new Date(now).getMonth();
  const [picked, setPicked] = useState<number | null>(null);
  const sel = picked ?? m;
  const video = useVideo("cundi");
  const [name, url] = CUNDI_MONTHS[sel] ?? ["", CUNDI_MONTHS[0][1]];
  return (
    <>
      <VideoRow key={sel} videoKey="cundi" href={url} label={sel < 0 ? "本月" : `${sel === m ? "本月" : "已選"} · ${name}`} />
      {/* 寬度夠就十二個月一排，窄一點兩排、手機三排 */}
      <div className="@container mt-2.5">
        <div className="grid grid-cols-4 gap-1.5 @min-[22rem]:grid-cols-6 @min-[34rem]:grid-cols-12 @min-[34rem]:gap-1">
          {CUNDI_MONTHS.map(([n], i) => (
            <button
              key={n}
              type="button"
              aria-pressed={i === sel}
              data-chant
              onClick={() => { setPicked(i); video.show(); }}
              className={`cursor-pointer rounded-lg border py-1.5 text-center text-sm whitespace-nowrap @min-[34rem]:text-[0.8125rem] ${
                i === sel ? "border-kasaya bg-kasaya font-bold text-paper" : i === m ? "border-kasaya bg-paper font-bold text-kasaya" : "border-line bg-paper text-muted"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
