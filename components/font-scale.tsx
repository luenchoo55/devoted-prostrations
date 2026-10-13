"use client";

import { setFontScale, useFontScale, type FontScale } from "@/lib/stores";

const OPTIONS: [FontScale, string][] = [["s", "小"], ["m", "中"], ["l", "大"], ["xl", "特大"]];

// 經文字級切換：所有經文、咒語、迴向文一起放大縮小
export function FontScaleControl({ className = "" }: { className?: string }) {
  const scale = useFontScale();
  return (
    <div className={`flex items-center justify-between gap-2.5 ${className}`}>
      <span className="text-[0.8125rem] text-muted">經文字級</span>
      <div role="group" aria-label="經文字級" className="inline-flex overflow-hidden rounded-full border border-line font-sans">
        {OPTIONS.map(([f, label]) => (
          <button
            key={f}
            type="button"
            aria-pressed={scale === f}
            onClick={() => setFontScale(f)}
            className={`cursor-pointer px-3 py-1 text-sm ${scale === f ? "bg-kasaya text-paper" : "text-muted"}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
