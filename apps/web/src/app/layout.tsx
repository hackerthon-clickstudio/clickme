// 앱 전역 레이아웃. 반응형 앱 셸로 화면을 감싼다. 로직 금지.
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import AppShell from "@/shared/ui/AppShell";

import "./globals.css";

export const metadata: Metadata = {
  title: "클릭미",
  description: "AI 기반 광고 캠페인 도구",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
