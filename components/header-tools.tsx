"use client";

import { useRef, useState } from "react";
import { daysTo, fmtDate, fmtTime, nextEclipse } from "@/lib/eclipse";
import { activeSteps, LINKS } from "@/lib/ritual";
import { resetRitual, setOffering, useNow, useRitual } from "@/lib/stores";
import { Modal, modalBtn as btn } from "./modal";
import { PlayIcon, Player, useVideo } from "./video";

const chip = "cursor-pointer rounded-full border bg-paper px-3.5 py-1.5 text-sm";
const SEEN_KEY = "tmg-ecl-seen";

export function HeaderTools() {
  const { done, offering } = useRitual();
  const steps = activeSteps(offering);
  const finished = steps.filter((id) => done.includes(id)).length;

  const now = useNow();
  const next = now === null ? undefined : nextEclipse(now);
  // null：依「14 天內且本次開頁未看過」自動決定；true/false：使用者手動開關
  const [eclipseOpen, setEclipseOpen] = useState<boolean | null>(null);
  const autoEclipse = (() => {
    if (!next || now === null) return false;
    let seen = null;
    try { seen = sessionStorage.getItem(SEEN_KEY); } catch {}
    return daysTo(next, now) <= 14 && seen !== String(next.t);
  })();
  // 先問供品，再提醒月食
  const showEclipse = offering !== null && (eclipseOpen ?? autoEclipse);
  const eclipseVideo = useVideo("eclipse-modal");
  const closeEclipse = () => {
    if (eclipseVideo.open) eclipseVideo.toggle();
    setEclipseOpen(false);
    try { sessionStorage.setItem(SEEN_KEY, String(next?.t ?? "")); } catch {}
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-20 h-[0.1875rem] bg-line/60" aria-hidden>
        <div className="h-full bg-kasaya transition-[width] duration-500" style={{ width: `${(finished / steps.length) * 100}%` }} />
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <WakeLockChip />
        <button type="button" className={`${chip} border-line`} onClick={() => { resetRitual(); window.scrollTo({ top: 0 }); }}>
          重新開始
        </button>
        <button
          type="button"
          className={`${chip} ${offering ? "border-gold bg-gold-soft" : "border-line"}`}
          aria-pressed={!!offering}
          onClick={() => setOffering(!offering)}
        >
          {offering ? "有供品" : "無供品"}
        </button>
        {next && (
          <button type="button" className={`${chip} border-gold text-gold`} onClick={() => setEclipseOpen(true)}>
            下次月食 {fmtDate(next.t, false)}
          </button>
        )}
        <span className="text-sm text-muted tabular-nums">
          已完成 {finished} / {steps.length}
        </span>
      </div>

      {offering === null && (
        <Modal labelledBy="offering-title">
          <span aria-hidden className="mx-auto grid size-14 place-items-center rounded-xl border-2 border-kasaya font-display text-[1.75rem] font-bold text-kasaya">
            供
          </span>
          <h3 id="offering-title" className="font-display text-2xl leading-snug">今天有準備供品嗎？</h3>
          <p>
            有供品的話，誦經之前要念
            <br />
            <b className="text-kasaya">「金剛薩埵百字明咒」三遍</b>
          </p>
          <p className="text-[0.8125rem] text-muted">之後可以在上方「有供品／無供品」切換</p>
          <div className="mt-1.5 flex flex-wrap justify-center gap-2">
            <button type="button" autoFocus className={`${btn} border-kasaya bg-kasaya text-paper`} onClick={() => setOffering(true)}>
              有供品
            </button>
            <button type="button" className={`${btn} border-line`} onClick={() => setOffering(false)}>
              沒有
            </button>
          </div>
        </Modal>
      )}

      {showEclipse && next && now !== null && (
        <Modal labelledBy="eclipse-title" onClose={closeEclipse}>
          <EclipseDisc className="mx-auto size-14" />
          <h3 id="eclipse-title" className="font-display text-2xl leading-snug">
            {(() => {
              const d = daysTo(next, now);
              return d <= 0 ? "今天月食" : d === 1 ? "明天月食" : `還有 ${d} 天月食`;
            })()}
          </h3>
          <p className="text-lg font-bold text-kasaya tabular-nums">
            {fmtDate(next.t)} 食甚 {fmtTime(next.t)}
          </p>
          <p className="text-[0.8125rem] text-muted">
            {next.type} · 台灣{next.vis}
          </p>
          <p>月食時念誦《普賢王如來發願偈》，功德極大。</p>
          {eclipseVideo.open && <Player href={LINKS.pxw} title="普賢王如來祈禱能顯自然智根本願文" />}
          <div className="mt-1.5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              aria-expanded={eclipseVideo.open}
              data-chant
              onClick={eclipseVideo.toggle}
              className={`${btn} flex items-center gap-1.5 ${eclipseVideo.open ? "border-kasaya text-kasaya" : "border-kasaya bg-kasaya text-paper"}`}
            >
              {eclipseVideo.open ? "收起影片" : <><PlayIcon />播放願文</>}
            </button>
            <button type="button" autoFocus className={`${btn} border-line`} onClick={closeEclipse}>
              知道了
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

function WakeLockChip() {
  const lock = useRef<WakeLockSentinel | null>(null);
  const [state, setState] = useState<"off" | "on" | "unsupported">("off");
  const toggle = async () => {
    if (lock.current) {
      try { await lock.current.release(); } catch {}
      return;
    }
    try {
      const l = await navigator.wakeLock.request("screen");
      lock.current = l;
      setState("on");
      l.addEventListener("release", () => { lock.current = null; setState("off"); });
    } catch {
      setState("unsupported");
    }
  };
  return (
    <button
      type="button"
      aria-pressed={state === "on"}
      onClick={toggle}
      className={`${chip} ${state === "on" ? "border-gold bg-gold-soft" : "border-line"}`}
    >
      {state === "on" ? "螢幕常亮中" : state === "unsupported" ? "此裝置不支援常亮" : "螢幕常亮"}
    </button>
  );
}

export function EclipseDisc({ className = "size-[1.625rem]" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`block flex-none rounded-full ${className}`}
      style={{ background: "radial-gradient(circle at 62% 40%, var(--paper) 0 46%, var(--gold) 48%)" }}
    />
  );
}
