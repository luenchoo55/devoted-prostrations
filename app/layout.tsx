import type { Metadata, Viewport } from "next";
import { LXGW_WenKai_TC, Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import "./globals.css";

// 中文字型檔很大，不預載，交給 unicode-range 按需下載
const wenkai = LXGW_WenKai_TC({
  variable: "--font-wenkai",
  weight: ["400", "700"],
  subsets: ["latin"],
  preload: false,
});

const notoSans = Noto_Sans_TC({
  variable: "--font-noto-sans",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  preload: false,
});

// 只給打卡感謝小卡（canvas）用，用到才下載
const notoSerif = Noto_Serif_TC({
  variable: "--font-noto-serif",
  weight: ["500", "700"],
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "在天滿宮虔誠磕頭",
  description: "每週三天滿宮修持：點燈、準提祈禱、功德倍增咒、誦經、迴向，依序完成。",
  // 私人網站：不讓搜尋引擎收錄
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#f3efe6",
};

// 在畫面繪製前決定主題（使用者選過的優先，否則一律白天），避免閃一下
const themeScript = `try{var t=localStorage.getItem("tmg-theme");if(t!=="dark")t="light";document.documentElement.dataset.theme=t;var f=JSON.parse(localStorage.getItem("tmg-font")||"null");if(f)document.documentElement.dataset.font=f}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-Hant" className={`${wenkai.variable} ${notoSans.variable} ${notoSerif.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
