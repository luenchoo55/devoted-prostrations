"use client";

import { useEffect, useState } from "react";
import { Modal, modalBtn as btn } from "./modal";

const W = 1080;
const H = 1350;
const TITLE = "感恩共修";
const SUBTITLE = "天滿宮・週三共修";
const MESSAGE = "隨喜您今日一同精進　功德圓滿";
const VERSE = ["願以此功德", "普及於一切", "我等與眾生", "皆共成佛道"];
const WEEK = "日一二三四五六";

// 感謝小卡固定用米紙配朱紅，不跟深色模式
const C = {
  paper: "#f3eee4",
  panel: "#ece6db",
  box: "#e4ddd1",
  rule: "#e2d2c6",
  edge: "#e6c8bc",
  ink: "#2f2722",
  muted: "#8a7e72",
  red: "#a8392a",
};

// 固定種子的亂數，每次畫出同一枝梅
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function blossom(g: CanvasRenderingContext2D, x: number, y: number, r: number) {
  g.save();
  g.translate(x, y);
  g.fillStyle = C.paper;
  g.strokeStyle = C.red;
  g.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    g.beginPath();
    g.arc(Math.cos(a) * r * 0.85, Math.sin(a) * r * 0.85, r * 0.62, 0, Math.PI * 2);
    g.fill();
    g.stroke();
  }
  g.fillStyle = C.red;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.6;
    g.beginPath();
    g.arc(Math.cos(a) * r * 0.45, Math.sin(a) * r * 0.45, 1.8, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
}

function bud(g: CanvasRenderingContext2D, x: number, y: number, r: number) {
  g.fillStyle = C.red;
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
}

// 梅枝：每段略微轉折，節點分出小枝，枝梢開花或結苞
function branch(g: CanvasRenderingContext2D, rnd: () => number, x: number, y: number, a: number, len: number, w: number, depth: number) {
  const segs = 4;
  for (let i = 0; i < segs; i++) {
    a += (rnd() - 0.5) * 0.7;
    const nx = x + Math.cos(a) * (len / segs);
    const ny = y + Math.sin(a) * (len / segs);
    g.strokeStyle = C.red;
    g.lineWidth = Math.max(1.5, w * (1 - (i / segs) * 0.55));
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(nx, ny);
    g.stroke();
    x = nx;
    y = ny;
    if (depth > 0 && rnd() < 0.6) branch(g, rnd, x, y, a + (rnd() < 0.5 ? -1 : 1) * (0.5 + rnd() * 0.5), len * 0.55, w * 0.55, depth - 1);
    if (depth <= 1 && i > 0 && rnd() < 0.45) {
      const side = rnd() < 0.5 ? -1 : 1;
      const ox = x + Math.cos(a + side * 1.4) * 14;
      const oy = y + Math.sin(a + side * 1.4) * 14;
      if (rnd() < 0.6) blossom(g, ox, oy, 11 + rnd() * 4);
      else bud(g, ox, oy, 4.5);
    }
  }
  if (depth === 0) blossom(g, x, y, 12 + rnd() * 4);
  else bud(g, x + Math.cos(a) * 8, y + Math.sin(a) * 8, 5);
}

async function drawCard(date: Date) {
  const css = getComputedStyle(document.documentElement);
  const serif = css.getPropertyValue("--font-noto-serif").trim() || "serif";
  const sans = css.getPropertyValue("--font-noto-sans").trim() || "sans-serif";
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const all = TITLE + SUBTITLE + MESSAGE + VERSE.join("") + "一二三四滿" + WEEK + "在天滿宮虔誠磕頭0123456789.PM";
  // 中文字型按 unicode-range 分片下載，先把要用的字載好再畫
  await Promise.all([
    document.fonts.load(`700 100px ${serif}`, all),
    document.fonts.load(`500 40px ${serif}`, all),
    document.fonts.load(`400 30px ${sans}`, all + "Devoted Prostrations at Divine Space"),
  ]).catch(() => {});

  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d")!;
  g.lineCap = "round";
  g.lineJoin = "round";
  g.textAlign = "center";
  g.textBaseline = "middle";

  // 紙底與外緣的細線
  g.fillStyle = C.paper;
  g.fillRect(0, 0, W, H);
  g.strokeStyle = C.edge;
  g.lineWidth = 2;
  for (const y of [38, 50, H - 50, H - 38]) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(W, y);
    g.stroke();
  }
  for (const x of [W - 50, W - 38]) {
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x, H);
    g.stroke();
  }

  // 朱紅框內：底色與直條格線
  const fx = 80, fy = 100, fw = 900, fh = 1140;
  g.fillStyle = C.panel;
  g.fillRect(fx, fy, fw, fh);
  g.strokeStyle = C.rule;
  g.lineWidth = 2;
  for (let x = fx + 80; x < fx + fw; x += 80) {
    g.beginPath();
    g.moveTo(x, fy);
    g.lineTo(x, fy + fh);
    g.stroke();
  }

  // 梅枝：左上垂下一枝、右下斜上一枝
  g.save();
  g.beginPath();
  g.rect(fx, fy, fw, fh);
  g.clip();
  branch(g, seeded(7), fx - 10, fy + 30, 0.3, 190, 8, 1);
  branch(g, seeded(23), fx + fw + 10, fy + fh - 40, Math.PI + 0.55, 420, 13, 3);
  g.restore();

  g.strokeStyle = C.red;
  g.lineWidth = 7;
  g.strokeRect(fx, fy, fw, fh);

  const vtext = (s: string, x: number, y0: number, step: number, font: string, color: string) => {
    g.font = font;
    g.fillStyle = color;
    [...s].forEach((ch, i) => g.fillText(ch, x, y0 + i * step));
  };

  // 右上標題框
  g.fillStyle = C.box;
  g.fillRect(820, 130, 140, 520);
  g.strokeStyle = "#cdbcaf";
  g.lineWidth = 2;
  g.strokeRect(820, 130, 140, 520);
  g.strokeRect(828, 138, 124, 504);
  vtext(TITLE, 890, 210, 122, `700 104px ${serif}`, C.ink);

  // 小朱印「滿」
  g.fillStyle = C.red;
  g.fillRect(864, 672, 52, 52);
  g.font = `700 34px ${serif}`;
  g.fillStyle = C.paper;
  g.fillText("滿", 890, 699);

  // 副標：兩端點綴小紅圈
  vtext(SUBTITLE, 760, 200, 50, `500 38px ${serif}`, C.ink);
  g.strokeStyle = C.red;
  g.lineWidth = 2;
  for (const y of [160, 200 + SUBTITLE.length * 50]) {
    g.beginPath();
    g.arc(760, y, 6, 0, Math.PI * 2);
    g.stroke();
  }

  vtext(MESSAGE, 680, 200, 38, `500 28px ${serif}`, C.muted);

  // 迴向偈四行，各以紅圓標號
  VERSE.forEach((line, i) => {
    const x = 600 - i * 80;
    bud(g, x, 200, 20);
    g.font = `500 24px ${serif}`;
    g.fillStyle = C.paper;
    g.fillText("一二三四"[i], x, 201);
    vtext(line, x, 270, 64, `500 48px ${serif}`, C.ink);
  });

  // 左下日期區：年、月日、星期、斜線、時間
  const bx = 100, by = 760;
  g.strokeStyle = "#cdbcaf";
  g.lineWidth = 2;
  g.strokeRect(bx, by, 200, 400);
  g.textAlign = "left";
  g.font = `500 30px ${serif}`;
  g.fillStyle = C.ink;
  g.fillText(String(date.getFullYear()), bx + 24, by + 46);
  g.font = `500 60px ${serif}`;
  g.fillText(`${m}.${d}`, bx + 20, by + 108);
  g.textAlign = "center";
  g.strokeStyle = C.ink;
  g.lineWidth = 1.5;
  g.beginPath();
  g.arc(bx + 44, by + 170, 20, 0, Math.PI * 2);
  g.stroke();
  g.font = `500 22px ${serif}`;
  g.fillText(WEEK[date.getDay()], bx + 44, by + 171);
  g.beginPath();
  g.moveTo(bx + 24, by + 260);
  g.lineTo(bx + 176, by + 205);
  g.stroke();
  g.textAlign = "left";
  g.font = `500 60px ${serif}`;
  g.fillText("19.30", bx + 20, by + 310);
  g.textAlign = "center";
  g.beginPath();
  g.arc(bx + 44, by + 362, 20, 0, Math.PI * 2);
  g.stroke();
  g.font = `500 15px ${sans}`;
  g.fillText("PM", bx + 44, by + 363);

  g.font = `400 22px ${sans}`;
  g.fillStyle = C.muted;
  g.fillText("在天滿宮虔誠磕頭 · Devoted Prostrations at Divine Space", W / 2, H - 22);

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
        className="mt-1.5 mb-12 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-kasaya bg-paper px-4 py-3.5 font-display text-xl font-bold text-kasaya transition-transform active:scale-[.98]"
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
