"use client";

import { useState } from "react";
import { Modal, modalBtn } from "./modal";

const ADDRESS = "105臺北市松山區安平里寶清街111巷34號1樓";
const MAP_URL = "https://maps.app.goo.gl/YuBq5QSTdkVB1oLg6";

// 天滿宮地址：點圖示顯示地址，再問要不要打開 Google 地圖
export function LocationButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const close = () => { setOpen(false); setCopied(false); };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ADDRESS);
      setCopied(true);
    } catch {}
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="天滿宮地址"
        title="天滿宮地址"
        className="grid size-10 flex-none cursor-pointer place-items-center rounded-full border border-line bg-paper text-kasaya transition-colors hover:border-gold"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </svg>
      </button>

      {open && (
        <Modal labelledBy="location-title" onClose={close}>
          <span aria-hidden className="mx-auto grid size-14 place-items-center rounded-full bg-gold-soft text-kasaya">
            <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
          </span>
          <h3 id="location-title" className="font-display text-2xl leading-snug">天滿宮</h3>
          <p className="font-display text-lg leading-relaxed">{ADDRESS}</p>
          <button type="button" onClick={copy} className="justify-self-center cursor-pointer text-[0.8125rem] text-muted underline decoration-dotted underline-offset-4">
            {copied ? "已複製 ✓" : "複製地址"}
          </button>
          <p className="mt-1">要打開 Google 地圖嗎？</p>
          <div className="mt-1.5 flex flex-wrap justify-center gap-2">
            <a
              href={MAP_URL}
              target="_blank"
              rel="noopener"
              onClick={close}
              autoFocus
              className={`${modalBtn} border-kasaya bg-kasaya text-paper`}
            >
              打開 Google 地圖
            </a>
            <button type="button" className={`${modalBtn} border-line`} onClick={close}>
              不用了
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
