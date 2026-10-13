"use client";

import { useState } from "react";
import { Modal, modalBtn } from "./modal";

type Point = "crown" | "throat" | "heart";
type GuideStep = { tag: string; title: string; body: string; point?: Point; hands?: boolean };

const STEPS: GuideStep[] = [
  { tag: "準備", title: "站立合掌", hands: true, body: "身體站直，雙手合掌，掌心微空、拇指內收，像一朵含苞的蓮花，以虔誠心供養。" },
  { tag: "身", title: "合掌觸頭頂", point: "crown", body: "合掌輕觸頭頂（或眉間），淨除身的業障，領受諸佛身的加持。" },
  { tag: "口", title: "合掌觸喉間", point: "throat", body: "合掌移到喉間，淨除語（口）的業障，領受諸佛語的加持。" },
  { tag: "意", title: "合掌觸心間", point: "heart", body: "合掌移到心口，淨除意的業障，領受諸佛意的加持。" },
  { tag: "五體投地", title: "彎身拜下", body: "彎身跪下，雙手掌心向下放在前方，雙膝、雙手、額頭五處著地，放下我慢，全心皈依。" },
  { tag: "起身", title: "回到合掌", body: "雙手撐地起身，回到站姿合掌，這樣是一拜。" },
];

const POINT_Y: Record<Point, number> = { crown: 14, throat: 58, heart: 82 };

// 簡單人形，標出身口意的位置
function Figure({ point, hands }: { point?: Point; hands?: boolean }) {
  return (
    <svg viewBox="0 0 120 150" className="mx-auto h-36 text-muted" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="60" cy="32" r="16" />
        <path d="M54 48v6M66 48v6" />
        <path d="M30 148V86q0-26 30-30 30 4 30 30v62" />
      </g>
      {(["crown", "throat", "heart"] as Point[]).map((p) => (
        <circle key={p} cx="60" cy={POINT_Y[p]} r="4" className={p === point ? "fill-kasaya" : "fill-line"} />
      ))}
      {point && (
        <circle cx="60" cy={POINT_Y[point]} r="10" fill="none" stroke="var(--kasaya)" strokeWidth="1.5" className="animate-ping origin-center [transform-box:fill-box]" />
      )}
      {(hands || point) && (
        // 合掌的手，跟著位置移動
        <path
          d="M60 0l-6 10q-2 8 6 12 8-4 6-12z"
          transform={`translate(0 ${(point ? POINT_Y[point] : POINT_Y.heart) - 10})`}
          fill="var(--gold-soft)"
          stroke="var(--gold)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export function ProstrationGuide() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const last = i === STEPS.length - 1;
  const close = () => { setOpen(false); setI(0); };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 flex cursor-pointer items-center gap-1.5 text-[15px] text-kasaya underline decoration-dotted underline-offset-4"
      >
        如何身口意頂禮？教學 ▸
      </button>

      {open && (
        <Modal labelledBy="guide-title" onClose={close}>
          <div className="text-[13px] font-bold tracking-[.18em] text-gold">身口意頂禮 · {i + 1} / {STEPS.length}</div>
          {step.point || step.hands ? (
            <Figure point={step.point} hands={step.hands} />
          ) : (
            <div aria-hidden className="mx-auto grid h-36 place-items-center font-display text-5xl text-kasaya">
              {last ? "禮" : "拜"}
            </div>
          )}
          <h3 id="guide-title" className="font-display text-2xl leading-snug">
            <span className="mr-2 inline-grid size-9 place-items-center rounded-lg border-2 border-kasaya align-middle text-base text-kasaya">
              {step.tag.length === 1 ? step.tag : i + 1}
            </span>
            {step.title}
          </h3>
          <p className="min-h-[5.25em] text-left">{step.body}</p>

          <div className="flex justify-center gap-1.5" aria-hidden>
            {STEPS.map((_, j) => (
              <span key={j} className={`h-1.5 rounded-full transition-all ${j === i ? "w-5 bg-kasaya" : "w-1.5 bg-line"}`} />
            ))}
          </div>

          {last && <p className="text-[13px] text-muted">頂禮時心中專注於所皈依的對象。各傳承細節略有不同，以上師所教為準。</p>}

          <div className="mt-1.5 flex justify-center gap-2">
            <button type="button" className={`${modalBtn} border-line disabled:opacity-40`} disabled={i === 0} onClick={() => setI(i - 1)}>
              上一步
            </button>
            <button
              type="button"
              autoFocus
              className={`${modalBtn} border-kasaya bg-kasaya text-paper`}
              onClick={() => (last ? close() : setI(i + 1))}
            >
              {last ? "我學會了" : "下一步"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
