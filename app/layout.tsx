import type { Metadata, Viewport } from "next";
import { LXGW_WenKai_TC, Noto_Sans_TC } from "next/font/google";
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

export const metadata: Metadata = {
  title: "在天滿宮虔誠磕頭",
  description: "每週三天滿宮修持：點燈、準提祈禱、功德倍增咒、誦經、迴向，依序完成。",
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3efe6" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1613" },
  ],
};

// 在畫面繪製前決定主題（使用者選過的優先，否則跟系統），避免閃一下
const themeScript = `try{var t=localStorage.getItem("tmg-theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t;var f=JSON.parse(localStorage.getItem("tmg-font")||"null");if(f)document.documentElement.dataset.font=f}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-Hant" className={`${wenkai.variable} ${notoSans.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
