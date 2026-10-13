"use client";

import { DABEI, ROMAN, toZhuyin } from "@/lib/dabei";
import { setDabeiMode, useDabeiMode, type DabeiMode } from "@/lib/stores";

const MODES: [DabeiMode, string][] = [["py", "拼音"], ["zy", "注音"], ["ro", "羅馬拼音"], ["none", "不標"]];

export function Dabei() {
  const mode = useDabeiMode();
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <span className="text-[13px] text-muted">讀音標示</span>
        <div role="group" aria-label="讀音標示" className="inline-flex overflow-hidden rounded-full border border-line">
          {MODES.map(([m, label]) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setDabeiMode(m)}
              className={`cursor-pointer px-3 py-1 text-sm ${mode === m ? "bg-kasaya text-paper" : "text-muted"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ol className="dharani grid gap-1" data-mode={mode}>
        {DABEI.map(([hz, py], i) => {
          const syl = py.split(" ");
          return (
            <li key={i} className="grid grid-cols-[2.2em_1fr] items-end gap-1.5 border-b border-dotted border-line py-[3px]">
              <span className="pb-1.5 text-xs text-gold tabular-nums">{i + 1}</span>
              <span className="flex min-w-0 flex-wrap gap-x-0.5 font-display text-[22px] leading-normal">
                {[...hz].map((c, j) => {
                  const p = syl[j] ?? "";
                  const rt = mode === "py" ? p : mode === "zy" && p ? toZhuyin(p) : null;
                  return (
                    <ruby key={j}>
                      {c}
                      {rt !== null && <rt>{rt}</rt>}
                    </ruby>
                  );
                })}
              </span>
              {mode === "ro" && (
                <span className="col-start-2 min-w-0 pb-1 text-[15px] leading-normal break-words text-kasaya italic">{ROMAN[i]}</span>
              )}
            </li>
          );
        })}
      </ol>
      <p className="text-[13px] text-muted">
        拼音、注音採常見誦念讀法，與字典音不盡相同。羅馬拼音為梵文還原的通行版本，逐句對照，各家還原略有差異。
      </p>
    </div>
  );
}
