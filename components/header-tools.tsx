"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { daysUntil, KIND_LABEL, nextTensha, PRAYER_KINDS, shortName, upcomingEvents } from "@/lib/calendar";
import { daysTo, fmtDate, fmtTime, nextEclipse } from "@/lib/eclipse";
import { LINKS } from "@/lib/ritual";
import { resetRitual, setOffering, useNow, useRitual } from "@/lib/stores";
import { nextSession, SESSION_LABEL, splitDuration } from "@/lib/session";
import { getBgm, playBgm, useBgm } from "@/lib/bgm";
import { BgmPlayButton, BgmVolume } from "./bgm";
import { Modal, modalBtn as btn } from "./modal";
import { PlayIcon, Player, useVideo } from "./video";

const chip = "cursor-pointer rounded-full border bg-paper px-3.5 py-1.5 text-sm";
const SEEN_KEY = "tmg-ecl-seen";
const TENSHA_SEEN_KEY = "tmg-tensha-seen";
const pxwLink = "whitespace-nowrap text-kasaya underline decoration-dotted underline-offset-4";

// pxwText：願文全文，由伺服器端算好傳進來，避免把整份經文打包進前端
export function HeaderTools({ pxwText }: { pxwText: ReactNode }) {
  const { offering } = useRitual();

  const now = useNow();
  const next = now === null ? undefined : nextEclipse(now);
  // null：依「14 天內且本次開頁未看過」自動決定；true/false：使用者手動開關
  const [eclipseOpen, setEclipseOpen] = useState<boolean | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [pxwOpen, setPxwOpen] = useState(false);
  const [pxwTextOpen, setPxwTextOpen] = useState(true);
  // 影片一打開就自動播放，所以開彈窗時登記為播放中，順便停掉背景音樂與其他影片
  const pxwVideo = useVideo("pxw-modal");
  const openPxw = () => {
    setPxwTextOpen(true);
    setPxwOpen(true);
    pxwVideo.show();
  };
  const closePxw = () => {
    if (pxwVideo.open) pxwVideo.toggle();
    setPxwOpen(false);
  };
  const upcoming = now === null ? [] : upcomingEvents(now);
  // 每次打開先跳共修倒數，關掉後才問供品、提醒月食
  const showSession = useSessionModal() && now !== null;
  const autoEclipse = (() => {
    if (!next || now === null) return false;
    let seen = null;
    try { seen = sessionStorage.getItem(SEEN_KEY); } catch {}
    return daysTo(next, now) <= 14 && seen !== String(next.t);
  })();
  // 先問供品，再提醒月食
  const showEclipse = !showSession && offering !== null && (eclipseOpen ?? autoEclipse);
  // 天赦日前 3 天起提醒，排在月食之後；本次開頁看過就不再跳
  const tensha = now === null ? undefined : nextTensha(now);
  const [tenshaClosed, setTenshaClosed] = useState(false);
  const showTensha = (() => {
    if (!tensha || now === null || tenshaClosed || showSession || offering === null || showEclipse) return false;
    let seen = null;
    try { seen = sessionStorage.getItem(TENSHA_SEEN_KEY); } catch {}
    return daysUntil(tensha, now) <= 3 && seen !== tensha;
  })();
  const closeTensha = () => {
    setTenshaClosed(true);
    try { sessionStorage.setItem(TENSHA_SEEN_KEY, tensha ?? ""); } catch {}
  };
  const eclipseVideo = useVideo("eclipse-modal");
  const closeEclipse = () => {
    if (eclipseVideo.open) eclipseVideo.toggle();
    setEclipseOpen(false);
    try { sessionStorage.setItem(SEEN_KEY, String(next?.t ?? "")); } catch {}
  };

  return (
    <>
      <div className="mt-2.5 flex flex-wrap items-center gap-2">
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
        {upcoming[0] && now !== null && (
          <button type="button" className={`${chip} border-gold text-gold`} onClick={() => setCalendarOpen(true)}>
            {daysUntil(upcoming[0].date, now) === 0 ? "今天" : "下次"} · {shortName(upcoming[0])} {fmtDate(Date.parse(upcoming[0].date + "T12:00:00+08:00"), false).slice(5)}
          </button>
        )}
      </div>

      {showSession && <SessionModal onClose={() => setSessionModal(false)} />}

      {!showSession && offering === null && (
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

      {calendarOpen && now !== null && (
        <Modal labelledBy="calendar-title" onClose={() => setCalendarOpen(false)}>
          <h3 id="calendar-title" className="font-display text-2xl leading-snug">歲時節令</h3>
          <p className="text-[0.8125rem] text-muted">
            願文說「或於日月蝕時日……或於冬夏至年節」，標
            <span className="mx-1 inline-block size-2 rounded-full bg-kasaya align-middle" aria-hidden />
            的日子特別適合念誦《普賢王如來祈願文》。
          </p>
          <ol className="grid text-left">
            {upcoming.map((e) => {
              const d = daysUntil(e.date, now);
              const prayer = PRAYER_KINDS.includes(e.kind);
              const content = (
                <>
                  <span className="w-[4.5rem] flex-none text-sm text-muted tabular-nums">{fmtDate(Date.parse(e.date + "T12:00:00+08:00")).slice(5)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      {prayer && <span className="size-2 flex-none rounded-full bg-kasaya" aria-label="宜誦願文" />}
                      <span className="font-display text-[1.0625rem]">{e.name}</span>
                    </span>
                    <span className="flex flex-wrap items-center gap-x-2 text-xs text-muted">
                      {KIND_LABEL[e.kind]}
                      {/* 月食那列整列可點、會開月食提醒（裡面能播願文），這裡只做樣子 */}
                      {prayer &&
                        (e.kind === "lunar-eclipse" ? (
                          <span className={pxwLink}>普賢王如來祈願文 ▸</span>
                        ) : (
                          <button type="button" className={`${pxwLink} cursor-pointer`} onClick={() => { setCalendarOpen(false); openPxw(); }}>
                            普賢王如來祈願文 ▸
                          </button>
                        ))}
                    </span>
                  </span>
                  <span className={`flex-none text-xs tabular-nums ${d === 0 ? "font-bold text-kasaya" : "text-muted"}`}>{d === 0 ? "今天" : `${d} 天後`}</span>
                </>
              );
              const row = "flex w-full items-center gap-3 border-b border-line py-2.5";
              return (
                <li key={e.date + e.name}>
                  {e.kind === "lunar-eclipse" ? (
                    <button type="button" className={`${row} cursor-pointer text-left hover:bg-gold-soft/40`} onClick={() => { setCalendarOpen(false); setEclipseOpen(true); }}>
                      {content}
                    </button>
                  ) : (
                    <div className={row}>{content}</div>
                  )}
                </li>
              );
            })}
          </ol>
          <div className="mt-1.5 flex justify-center">
            <button type="button" autoFocus className={`${btn} border-line`} onClick={() => setCalendarOpen(false)}>
              關閉
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

      {pxwOpen && (
        <Modal labelledBy="pxw-title" onClose={closePxw}>
          <span aria-hidden className="mx-auto grid size-14 place-items-center rounded-xl bg-gold-soft font-display text-[1.75rem] font-bold text-kasaya">
            願
          </span>
          <h3 id="pxw-title" className="font-display text-2xl leading-snug">普賢王如來祈願文</h3>
          <p className="text-[0.9375rem]">
            願文說「或於日月蝕時日……或於冬夏至年節，發心自修為普賢，與眾虔敬誦此願」，這些日子念誦功德特別大。
          </p>
          {/* 打開彈窗就直接放影片 */}
          <Player href={LINKS.pxw} title="普賢王如來祈禱能顯自然智根本願文" />
          <div className="mt-1.5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              aria-expanded={pxwTextOpen}
              onClick={() => setPxwTextOpen(!pxwTextOpen)}
              className={`${btn} border-kasaya ${pxwTextOpen ? "text-kasaya" : "bg-kasaya text-paper"}`}
            >
              {pxwTextOpen ? "收起經文" : "展開經文"}
            </button>
            <button type="button" autoFocus className={`${btn} border-line`} onClick={closePxw}>
              關閉
            </button>
          </div>
          {pxwTextOpen && (
            <>
              <div className="mt-3 border-t border-line pt-4 text-left">{pxwText}</div>
              {/* 願文很長，底部再放一個關閉 */}
              <div className="mt-2 flex justify-center">
                <button type="button" className={`${btn} border-line`} onClick={closePxw}>
                  關閉
                </button>
              </div>
            </>
          )}
        </Modal>
      )}

      {showTensha && tensha && now !== null && (
        <Modal labelledBy="tensha-title" onClose={closeTensha}>
          <span aria-hidden className="mx-auto grid size-14 place-items-center rounded-xl border-2 border-kasaya font-display text-[1.75rem] font-bold text-kasaya">
            赦
          </span>
          <h3 id="tensha-title" className="font-display text-2xl leading-snug">
            {(() => {
              const d = daysUntil(tensha, now);
              return d === 0 ? "今天是天赦日" : d === 1 ? "明天是天赦日" : `還有 ${d} 天天赦日`;
            })()}
          </h3>
          <p className="text-lg font-bold text-kasaya tabular-nums">{fmtDate(Date.parse(tensha + "T12:00:00+08:00"))}</p>
          <p>天赦日是一年中難得的大吉日，上天赦免罪過，宜懺悔、誦經、行善、發願。</p>
          <div className="mt-1.5 flex justify-center">
            <button type="button" autoFocus className={`${btn} border-line`} onClick={closeTensha}>
              知道了
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

// 共修倒數彈窗的開關：打開頁面時預設開啟，右下角按鈕也能再打開
let sessionModal = true;
const sessionListeners = new Set<() => void>();
const subscribeSession = (l: () => void) => {
  sessionListeners.add(l);
  return () => { sessionListeners.delete(l); };
};
export const useSessionModal = () => useSyncExternalStore(subscribeSession, () => sessionModal, () => true);
export function setSessionModal(open: boolean) {
  sessionModal = open;
  sessionListeners.forEach((l) => l());
}

// 共修倒數：每秒更新
function SessionModal({ onClose }: { onClose: () => void }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const bgm = useBgm();
  const { start, live } = nextSession(now);
  const { d, h, m, s } = splitDuration(start - now);
  const units: [number, string][] = [[d, "天"], [h, "時"], [m, "分"], [s, "秒"]];
  return (
    <Modal labelledBy="session-title" onClose={onClose}>
      <div className="text-[0.8125rem] font-bold tracking-[.18em] text-gold">{SESSION_LABEL} · 天滿宮共修</div>
      <h3 id="session-title" className="font-display text-2xl leading-snug">
        {live ? "共修進行中！" : "共修要開始咯！"}
      </h3>
      {live ? (
        <p className="font-display text-lg text-kasaya">已於 {fmtTime(start)} 開始，快來一起修持</p>
      ) : (
        <div className="mx-auto grid w-full max-w-[16.5rem] grid-cols-4 gap-2" role="timer" aria-live="off">
          {units.map(([v, unit]) => (
            <div key={unit} className="grid gap-0.5 rounded-xl border border-line bg-rice py-2">
              <span className="font-display text-[1.75rem] leading-none font-bold text-kasaya tabular-nums">
                {unit === "天" ? v : String(v).padStart(2, "0")}
              </span>
              <span className="text-xs text-muted">{unit}</span>
            </div>
          ))}
        </div>
      )}
      <p className="text-[0.8125rem] text-muted">{live ? "本次" : "下次"}共修：{fmtDate(start)} {fmtTime(start)}</p>
      <p className="font-display text-xl">準備好磕頭唱歌了嗎？</p>
      {/* 彈窗開著時背景音樂照常播放，也能在這裡控制 */}
      <div className="grid gap-1.5 rounded-xl border border-dashed border-line px-3 py-2 text-left">
        <div className="flex items-center gap-2.5">
          <BgmPlayButton small />
          <div className="min-w-0 flex-1">
            <div className="truncate font-display">聖救度佛母二十一種禮讚經</div>
            <div className="text-xs text-muted">{bgm === "idle" ? "點任一處開始播放背景音樂" : bgm === "playing" ? "背景音樂播放中" : "背景音樂已暫停"}</div>
          </div>
        </div>
        <BgmVolume />
      </div>
      <div className="mt-1.5 flex justify-center">
        <button
          type="button"
          autoFocus
          className={`${btn} border-kasaya bg-kasaya text-paper`}
          onClick={() => {
            if (getBgm() === "idle") playBgm().catch(() => {});
            onClose();
          }}
        >
          準備好了
        </button>
      </div>
    </Modal>
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
