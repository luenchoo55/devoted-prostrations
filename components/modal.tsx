"use client";

import type { ReactNode } from "react";

export const modalBtn = "cursor-pointer rounded-full border px-[18px] py-2 text-[15px] no-underline";

// 沒給 onClose 的彈窗必須按按鈕回答，點背景或 Esc 不會關
export function Modal({ labelledBy, onClose, children }: { labelledBy: string; onClose?: () => void; children: ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-30 grid place-items-center bg-[rgba(20,14,10,.55)] p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
      onKeyDown={(e) => { if (e.key === "Escape") onClose?.(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="grid max-h-[calc(100dvh-2rem)] w-full max-w-[420px] gap-2.5 overflow-y-auto rounded-[18px] border border-gold bg-paper px-[22px] pt-[26px] pb-5 text-center text-ink"
      >
        {children}
      </div>
    </div>
  );
}
