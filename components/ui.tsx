import type { ReactNode } from "react";
import TEXTS from "@/lib/texts.json";

type Block = [string, string | string[]];
export type TextKey = keyof typeof TEXTS;

export const card = "rounded-xl border border-line bg-paper";

export function Note({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-muted">{children}</p>;
}

// 可收合的經文卷
export function Scroll({ summary, open, children }: { summary: string; open?: boolean; children: ReactNode }) {
  return (
    <details open={open} className={`group/scr ${card} mt-2`}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2.5 px-4 py-2.5 text-[0.9375rem] text-muted group-open/scr:border-b group-open/scr:border-line">
        {summary}
        <span className="flex-none text-[0.8125rem] text-kasaya">
          <span className="group-open/scr:hidden">展開 ▾</span>
          <span className="hidden group-open/scr:inline">收合 ▴</span>
        </span>
      </summary>
      <div className="mx-4 mt-3 mb-4">{children}</div>
    </details>
  );
}

// p：散文段落；v：偈頌（逐行）；n：佛號列表
export function ScriptureBody({ k }: { k: TextKey }) {
  return (
    <div className="grid gap-3 font-display text-[1.1875rem] leading-[1.95]">
      {(TEXTS[k] as Block[]).map(([kind, v], i) => {
        if (kind === "n")
          return (
            <div key={i} className="grid grid-cols-[repeat(auto-fill,minmax(11em,1fr))] gap-x-3.5 gap-y-0.5 text-lg leading-[1.9]">
              {(v as string[]).map((name) => (
                <span key={name} className="min-w-0">{name}</span>
              ))}
            </div>
          );
        if (kind === "v")
          return (
            <p key={i} className="border-l-3 border-gold-soft pl-3">
              {(v as string[]).map((line, j) => (
                <span key={j} className="block">{line}</span>
              ))}
            </p>
          );
        return <p key={i}>{v as string}</p>;
      })}
    </div>
  );
}

export function Verses({ children }: { children: ReactNode }) {
  return <div className="grid gap-3.5 border-l-3 border-gold px-4 py-1.5 font-display text-[1.1875rem] leading-[1.9]">{children}</div>;
}
