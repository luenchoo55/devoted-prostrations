"use client";

import { toZhuyin } from "@/lib/dabei";
import { setDabeiMode, useDabeiMode, type DabeiMode } from "@/lib/stores";

const MODES: [DabeiMode, string][] = [["py", "拼音"], ["zy", "注音"], ["none", "不標"]];

// 注音直排在字的右邊（台灣課本式）：聲調標在注音右側，輕聲「˙」在最上面
function ZhuyinChar({ char, zhuyin }: { char: string; zhuyin: string }) {
  const light = zhuyin.startsWith("˙");
  const tone = /[ˊˇˋ]$/.exec(zhuyin)?.[0];
  const symbols = [...zhuyin.replace(/[˙ˊˇˋ]/g, "")];
  return (
    <span className="inline-flex items-center">
      <span>{char}</span>
      {symbols.length > 0 && (
        <span className="relative ml-[0.08em] flex flex-col items-center font-sans text-[0.5em] leading-[1.05] text-muted">
          {light && <span className="leading-[0.6]">˙</span>}
          {symbols.map((z, k) => (
            <span key={k}>{z}</span>
          ))}
          {tone && (
            <span className="absolute top-1/2 left-full -translate-y-[10%] pl-[0.05em] leading-none">{tone}</span>
          )}
        </span>
      )}
      {/* 聲調佔的位置，避免和下一個字擠在一起 */}
      {tone && <span className="w-[0.28em]" aria-hidden />}
    </span>
  );
}

// 一句咒：逐字標拼音或注音
function Syllables({ hz, py, mode }: { hz: string; py: string; mode: DabeiMode }) {
  const syl = py.split(" ");
  return [...hz].map((c, j) => {
    const p = syl[j] ?? "";
    if (mode === "zy") return <ZhuyinChar key={j} char={c} zhuyin={p ? toZhuyin(p) : ""} />;
    const rt = mode === "py" ? p : null;
    return (
      <ruby key={j}>
        {c}
        {rt !== null && <rt>{rt}</rt>}
      </ruby>
    );
  });
}

// 拼音／注音／不標 切換，各段咒語共用同一個設定
function ReadingToggle() {
  const mode = useDabeiMode();
  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5">
      <span className="font-sans text-[0.8125rem] leading-normal text-muted">讀音標示</span>
      <div role="group" aria-label="讀音標示" className="inline-flex overflow-hidden rounded-full border border-line">
        {MODES.map(([m, label]) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => setDabeiMode(m)}
            className={`cursor-pointer px-3 py-1 font-sans text-sm leading-normal ${mode === m ? "bg-kasaya text-paper" : "text-muted"}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

const NOTE = <p className="font-sans text-[0.8125rem] leading-normal text-muted">拼音、注音採常見誦念讀法，與字典音不盡相同。</p>;

// 一句一行、左側標句數（大悲咒的排法）
function NumberedLines({ lines, mode }: { lines: [string, string][]; mode: DabeiMode }) {
  return (
    <ol className="dharani grid gap-1" data-mode={mode}>
      {lines.map(([hz, py], i) => (
        <li key={i} className="grid grid-cols-[2.2em_1fr] items-end gap-1.5 border-b border-dotted border-line py-[0.1875rem]">
          <span className="pb-1.5 font-sans text-xs leading-normal text-gold tabular-nums">{i + 1}</span>
          <span
            className={`flex min-w-0 flex-wrap font-display text-[calc(1.375rem*var(--scr))] leading-normal ${
              mode === "zy" ? "items-center gap-x-1.5 gap-y-1 py-1" : "gap-x-0.5"
            }`}
          >
            <Syllables hz={hz} py={py} mode={mode} />
          </span>
        </li>
      ))}
    </ol>
  );
}

// 經文中的咒：短咒一組一組橫排（如金剛經真言），numbered 則一句一行標句數（如普門品後的大悲咒）
export function Mantra({ title, phrases, numbered }: { title?: string; phrases: [string, string][]; numbered?: boolean }) {
  const mode = useDabeiMode();
  return (
    <div className="grid gap-3 rounded-xl bg-gold-soft/40 p-3">
      {title && <div className="text-center font-bold tracking-wider text-kasaya">{title}</div>}
      <ReadingToggle />
      {numbered ? (
        <NumberedLines lines={phrases} mode={mode} />
      ) : (
        <div className="dharani flex flex-wrap items-end gap-x-4 gap-y-2" data-mode={mode}>
          {phrases.map(([hz, py], i) => (
            <span key={i} className={`inline-flex ${mode === "zy" ? "items-center gap-x-1.5" : "gap-x-0.5"}`}>
              <Syllables hz={hz} py={py} mode={mode} />
            </span>
          ))}
        </div>
      )}
      {NOTE}
    </div>
  );
}
