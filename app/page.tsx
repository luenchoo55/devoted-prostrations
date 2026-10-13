import { Bgm } from "@/components/bgm";
import { Dabei } from "@/components/dabei";
import { EclipseTable } from "@/components/eclipse-table";
import { EclipseDisc, HeaderTools } from "@/components/header-tools";
import { LocationButton } from "@/components/location";
import { ProstrationGuide } from "@/components/prostration-guide";
import { CundiMonths, MantraCounter, Step } from "@/components/ritual";
import { SutraCard } from "@/components/sutra-card";
import { Toc } from "@/components/toc";
import { ThemeToggle } from "@/components/theme-toggle";
import { VideoRow } from "@/components/video";
import { card, Note, Scroll, ScriptureBody, Verses } from "@/components/ui";
import { LINKS } from "@/lib/ritual";

const DEDICATION = [
  [ "文殊師利勇猛智，普賢慧行亦復然，", "我今迴向諸善根，隨彼一切常修學。", "三世諸佛所稱歎，如是最勝諸大願，", "我今迴向諸善根，為得普賢殊勝行。" ],
  [ "上來諷經功德，迴向真如實際，莊嚴無上佛果菩提。", "四恩總報，三有齊資，法界有情，同圓種智。", "十方三世一切諸佛、諸尊菩薩摩訶薩、摩訶般若波羅蜜。" ],
  [ "願以此功德，消除宿現業，增長諸福慧，圓成勝善根。", "所有刀兵劫，及與饑饉等，咸皆盡滅除，世界永昇平。", "風雨常調順，人民悉安寧，法界諸含識，同證無上道。" ],
  [ "願消三障諸煩惱，願得智慧真明了。", "普願罪障悉消除，世世常行菩薩道。" ],
  [ "願我所修諸功德，資益一切諸眾生，", "悉共迴向於佛智，速得至於涅槃城。", "我此普賢殊勝行，無邊勝福皆迴向，", "普願沉溺諸眾生，速往無量光佛剎。" ],
  [ "願以此功德，普及於一切，", "我等與眾生，皆共成佛道。" ],
];

// 皈依文念一遍，再頂禮三遍
function Refuge() {
  return (
    <>
      <Verses stanzas={[["皈依頂禮本師釋迦牟尼佛，", "以及諸佛壇城的所有三寶三根本。"]]} />
      <p className="mt-2 inline-block rounded-md bg-gold-soft px-2.5 py-0.5 text-sm">念一遍 → 頂禮身口意三遍</p>
    </>
  );
}

export default function Home() {
  return (
    <div className="px-4">
      <main className="mx-auto max-w-[40rem] pt-7 pb-36">
        <header className="grid gap-1.5 border-b border-line pb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="grid min-w-0 gap-1.5">
              <div className="text-[0.8125rem] font-bold tracking-[.18em] text-gold">每週三 · 天滿宮</div>
              <h1 className="font-display text-[clamp(1.875rem,8vw,2.625rem)] leading-tight font-bold text-balance">在天滿宮虔誠磕頭</h1>
              <p className="font-display text-[1.0625rem] tracking-wide text-kasaya italic">Devoted Prostrations at Divine Space</p>
            </div>
            <div className="flex flex-none flex-col items-center gap-3">
              <div className="flex gap-2">
                <LocationButton />
                <ThemeToggle />
              </div>
              {/* 朱印 */}
              <div
                aria-hidden
                className="grid rotate-3 place-items-center rounded-md border-2 border-kasaya px-1.5 py-2 font-display text-lg leading-[1.15] font-bold text-kasaya opacity-85 [writing-mode:vertical-rl]"
              >
                磕頭
              </div>
            </div>
          </div>
          <p className="text-[0.9375rem] text-muted">依序進行，完成一項就點「完成」。</p>
          <HeaderTools />
        </header>

        <Bgm />

        <ol className="mt-7 grid">
          <Step id="lamp" title="頂禮點燈開智慧">
            <Note>頂禮後，點燃酥油燈，在念經前記得焚香。</Note>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="rounded-md bg-gold-soft px-2.5 py-0.5 text-sm">手不可碰燈芯</p>
              <ProstrationGuide />
            </div>
          </Step>

          <Step id="cundi" title="準提佛母祈禱文">
            <Note>依當月份播放，本月已標示。</Note>
            <CundiMonths />
          </Step>

          <Step id="refuge1" title="皈依頂禮">
            <Refuge />
          </Step>

          <Step id="mantra" title="功德倍增咒 · 七遍">
            <MantraCounter
              id="mantra"
              zh="嗡 桑巴拉 桑巴拉 貝瑪納薩拉 瑪哈臧巴巴 吽呸 梭哈"
              lat="Om Smara Smara Vimana Sara Maha Java Hum Phat Svaha"
            />
          </Step>

          <Step id="vajrasattva" title="金剛薩埵百字明咒 · 三遍">
            <Note>今天有供品，念誦百字明咒三遍。</Note>
            <MantraCounter
              id="vajrasattva"
              zh="嗡 班雜 薩埵 薩瑪雅 瑪努巴拉雅 班雜 薩埵 爹諾巴 地叉 只左 美巴哇 蘇多卡約 美巴哇 蘇波卡約 美巴哇 阿努日阿多 美巴哇 薩爾瓦 悉地 美 札雅擦 薩爾瓦 嘎瑪 蘇雜美 即當 希日楊 古魯 吽 哈哈哈哈 吙 巴嘎萬 薩爾瓦 達他嘎達 班雜 瑪美 悶雜 班吉 巴哇 瑪哈 薩瑪雅 薩埵 阿"
              lat="Oṃ Vajrasattva samayam anupālaya, Vajrasattva tvenopatiṣṭha, dṛḍho me bhava, sutoṣyo me bhava, supoṣyo me bhava, anurakto me bhava, sarva siddhiṃ me prayaccha, sarva karma su ca me cittaṃ śreyaḥ kuru hūṃ, ha ha ha ha hoḥ, bhagavan sarva tathāgata vajra mā me muñca, vajrī bhava mahā samaya sattva āḥ"
            />
          </Step>

          <Step id="sutras" title="誦經">
            <Note>會念的三部經。</Note>
            <div className="mt-2 grid gap-3">
              <SutraCard id="sutra-diamond" glyph="金" title="金剛經" meta="金剛般若波羅蜜經 · 鳩摩羅什譯" href={LINKS.diamond}>
                <ScriptureBody k="diamond" />
              </SutraCard>
              <SutraCard id="sutra-pumen" glyph="普" title="普門品" meta="妙法蓮華經觀世音菩薩普門品" href={LINKS.pumen}>
                <ScriptureBody k="pumen" />
              </SutraCard>
              <SutraCard id="sutra-dabei" glyph="悲" title="大悲咒" meta="千手千眼無礙大悲心陀羅尼 · 八十四句">
                <Dabei />
              </SutraCard>
              <SutraCard id="sutra-b88" glyph="懺" title="八十八佛大懺悔文" meta="八十八佛洪名寶懺 · 普賢行願品偈" href={LINKS.b88}>
                <ScriptureBody k="b88" />
              </SutraCard>
            </div>
          </Step>

          <Step id="dedicate" title="迴向">
            <Scroll summary="迴向文" open>
              <Verses stanzas={DEDICATION} />
            </Scroll>
          </Step>

          <Step id="refuge2" title="皈依頂禮">
            <Refuge />
          </Step>
        </ol>

        <section id="eclipse" className={`${card} mt-1.5 grid scroll-mt-6 gap-2.5 border-gold p-5`}>
          <h2 className="flex items-center gap-2.5 font-display text-[1.375rem] font-bold">
            <EclipseDisc />
            月食修持
          </h2>
          <div className="grid gap-2 text-muted">
            <p>
              《普賢王如來祈願文》出自寧瑪派大圓滿密續《密意通徹》。願文中說：「或於日月蝕時日，風暴雷發地動變，或於冬夏至年節，發心自修為普賢，與眾虔敬誦此願」，能令三界有情解脫。因此月食時念誦此願文，是殊勝的修持時機。
            </p>
            <p>藏傳密續（如時輪金剛）的教法認為，日月食時外在的日、月相應於身內的脈與氣，氣較容易進入中脈，所以這時修持的力量特別大。</p>
          </div>
          <VideoRow href={LINKS.pxw} label="普賢王如來祈禱能顯自然智根本願文" />
          <Scroll summary="願文 經文">
            <ScriptureBody k="pxw" />
          </Scroll>
          <Scroll summary="月食小知識">
            <ul className="grid list-disc gap-1.5 pl-5 text-[0.9375rem] leading-relaxed">
              <li>月食只發生在滿月（農曆十五前後），太陽、地球、月亮排成一直線，月亮走進地球的影子。</li>
              <li>
                <b>月全食</b>：月亮整個進入地球本影，通常呈暗紅銅色，俗稱「血月」。
              </li>
              <li>
                <b>月偏食</b>：月亮只有一部分進入本影，看起來像被咬掉一塊。
              </li>
              <li>
                <b>半影月食</b>：月亮只進入較淡的半影，月面只是略微變暗，肉眼不太容易察覺。
              </li>
              <li>月食時只要月亮在地平線上，各地都能同時看到；台灣看不看得到，取決於當時月亮是否已經升起（白天就看不到）。</li>
              <li>表中時間是「食甚」，也就是食得最深的時刻；整個過程（含半影）常長達四到六小時。</li>
            </ul>
          </Scroll>
          <EclipseTable />
          <p className="text-[0.8125rem] text-muted">
            月食前 14 天起，打開此頁會跳出提醒。日期、食甚時間與類型已依 NASA 月食表（Espenak）核對，換算為台灣時間；「台灣」一欄為依月出月落推估的大致可見情形。
          </p>
        </section>

        <Toc />
        <footer className="mt-2.5 text-center text-[0.8125rem] text-muted">功德圓滿 · 南無阿彌陀佛</footer>
      </main>
    </div>
  );
}
