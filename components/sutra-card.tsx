"use client";

import { useRef, useState, type ReactNode } from "react";

// 一部經一張卡：上方標題與播放，下方展開經文；經文很長，底部也放一個收合
export function SutraCard({
  glyph,
  title,
  meta,
  href,
  children,
}: {
  glyph: string;
  title: string;
  meta: string;
  href?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const collapse = () => {
    setOpen(false);
    ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  return (
    <article ref={ref} className="scroll-mt-4 overflow-hidden rounded-2xl border border-line bg-paper transition-colors hover:border-gold/60">
      <div className="flex items-center gap-3 p-4">
        <div
          aria-hidden
          className="grid size-11 flex-none place-items-center rounded-xl bg-gold-soft font-display text-xl font-bold text-kasaya"
        >
          {glyph}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg leading-snug font-bold">{title}</h3>
          <p className="truncate text-[13px] text-muted">{meta}</p>
        </div>
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener"
            className="flex flex-none items-center gap-1 rounded-full bg-kasaya px-3.5 py-1.5 max-[420px]:px-2.5 max-[420px]:py-2.5 text-sm font-medium text-paper no-underline transition-opacity hover:opacity-90"
          >
            <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
              <path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.5-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5Z" />
            </svg>
            <span className="max-[420px]:sr-only">播放</span>
          </a>
        )}
      </div>

      <button
        type="button"
        aria-expanded={open}
        onClick={() => (open ? collapse() : setOpen(true))}
        className="flex w-full cursor-pointer items-center justify-between border-t border-line px-4 py-2.5 text-sm text-muted transition-colors hover:bg-gold-soft/40"
      >
        <span>{open ? "收合經文" : "閱讀經文"}</span>
        <span className={`text-kasaya transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <div className="border-t border-line px-4 pt-4 pb-3">
          {children}
          <button
            type="button"
            onClick={collapse}
            className="mt-4 w-full cursor-pointer rounded-full border border-line py-2 text-sm text-muted hover:border-gold"
          >
            收合 ▴
          </button>
        </div>
      )}
    </article>
  );
}
