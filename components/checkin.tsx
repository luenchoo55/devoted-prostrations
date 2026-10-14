"use client";

import { useEffect, useState } from "react";
import { Modal, modalBtn as btn } from "./modal";

const W = 1080;
const H = 1350;
const VERSE = ["願以此功德，普及於一切，", "我等與眾生，皆共成佛道。"];
const WEEK = "日一二三四五六";

// 感謝小卡固定用淺色經摺本配色，不跟深色模式
const C = { paper: "#fbf8f1", rice: "#f3efe6", ink: "#2a2420", muted: "#6f655b", kasaya: "#8a2f1d", gold: "#a8771c" };

const fmt = (d: Date) => `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日（${WEEK[d.getDay()]}）`;

async function drawCard(date: Date) {
  const css = getComputedStyle(document.documentElement);
  const display = css.getPropertyValue("--font-wenkai").trim() || "serif";
  const sans = css.getPropertyValue("--font-noto-sans").trim() || "sans-serif";
  const texts = ["感恩共修隨喜功德滿", VERSE.join(""), fmt(date), "每週三天滿宮共修在虔誠磕頭"].join("");
  // 中文字型按 unicode-range 分片下載，先把要用的字載好再畫
  await Promise.all([
    document.fonts.load(`700 100px ${display}`, texts),
    document.fonts.load(`400 40px ${display}`, texts),
    document.fonts.load(`400 30px ${sans}`, texts + "Devoted Prostrations at Divine Space"),
  ]).catch(() => {});

  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d")!;
  g.fillStyle = C.rice;
  g.fillRect(0, 0, W, H);
  g.fillStyle = C.paper;
  g.fillRect(40, 40, W - 80, H - 80);
  g.strokeStyle = C.gold;
  g.lineWidth = 3;
  g.strokeRect(64, 64, W - 128, H - 128);
  g.lineWidth = 1.5;
  g.strokeRect(78, 78, W - 156, H - 156);

  g.textAlign = "center";
  g.textBaseline = "middle";
  const text = (s: string, y: number, font: string, color: string, spacing = 0) => {
    g.font = font;
    g.fillStyle = color;
    g.letterSpacing = `${spacing}px`;
    g.fillText(s, W / 2 + spacing / 2, y);
  };

  text("每週三 · 天滿宮共修", 190, `700 34px ${sans}`, C.gold, 8);

  // 圓形朱印「滿」
  g.save();
  g.translate(W / 2, 400);
  g.rotate(-0.05);
  g.strokeStyle = C.kasaya;
  g.lineWidth = 9;
  g.beginPath();
  g.arc(0, 0, 118, 0, Math.PI * 2);
  g.stroke();
  g.lineWidth = 3;
  g.beginPath();
  g.arc(0, 0, 100, 0, Math.PI * 2);
  g.stroke();
  g.font = `700 128px ${display}`;
  g.fillStyle = C.kasaya;
  g.letterSpacing = "0px";
  g.fillText("滿", 0, 6);
  g.restore();

  text("感恩共修", 640, `700 112px ${display}`, C.ink, 16);
  text("隨喜您今日一同精進，功德圓滿", 750, `400 42px ${display}`, C.muted, 2);

  g.strokeStyle = C.gold;
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(W / 2 - 160, 840);
  g.lineTo(W / 2 + 160, 840);
  g.stroke();

  VERSE.forEach((line, i) => text(line, 930 + i * 76, `400 48px ${display}`, C.kasaya, 4));

  text(fmt(date), 1140, `400 36px ${sans}`, C.ink, 2);
  text("在天滿宮虔誠磕頭 · Devoted Prostrations at Divine Space", 1220, `400 26px ${sans}`, C.muted, 1);

  return new Promise<Blob | null>((r) => cv.toBlob(r, "image/png"));
}

// 完成共修的人打卡：彈出可下載的感謝小卡
export function CheckIn() {
  const [open, setOpen] = useState(false);
  const [card, setCard] = useState<{ url: string; name: string } | null>(null);

  useEffect(() => {
    if (!open) return;
    let url = "";
    let alive = true;
    const d = new Date();
    drawCard(d).then((blob) => {
      if (!blob || !alive) return;
      url = URL.createObjectURL(blob);
      const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
      setCard({ url, name: `天滿宮共修-${ymd}.png` });
    });
    return () => {
      alive = false;
      if (url) URL.revokeObjectURL(url);
      setCard(null);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-1.5 mb-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-kasaya bg-paper px-4 py-3.5 font-display text-xl font-bold text-kasaya transition-transform active:scale-[.98]"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
        我已完成共修 · 打卡
      </button>

      {open && (
        <Modal labelledBy="checkin-title" onClose={() => setOpen(false)}>
          <h3 id="checkin-title" className="font-display text-2xl leading-snug">感恩共修，功德圓滿</h3>
          <div className="mx-auto aspect-[4/5] w-full max-w-[18rem] overflow-hidden rounded-lg border border-line bg-rice">
            {card ? (
              // eslint-disable-next-line @next/next/no-img-element -- 用 canvas 即時產生的 blob 圖
              <img src={card.url} alt="共修感謝小卡" className="size-full object-contain" />
            ) : (
              <div className="grid size-full place-items-center text-sm text-muted">小卡製作中…</div>
            )}
          </div>
          <p className="text-[0.8125rem] text-muted">手機也可以長按圖片儲存或分享</p>
          <div className="mt-1 flex justify-center gap-2.5">
            <button type="button" className={`${btn} border-line`} onClick={() => setOpen(false)}>
              關閉
            </button>
            <a
              href={card?.url}
              download={card?.name}
              aria-disabled={!card}
              className={`${btn} border-kasaya bg-kasaya text-paper ${card ? "" : "pointer-events-none opacity-50"}`}
            >
              下載圖片
            </a>
          </div>
        </Modal>
      )}
    </>
  );
}
