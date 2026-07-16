// 앱 전역 레이아웃. 화면 조립만 담당하고 로직을 두지 않는다. 모바일 우선.
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
