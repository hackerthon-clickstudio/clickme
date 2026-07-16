// 반응형 앱 셸. 데스크톱(md+)은 좌측 사이드바, 모바일은 하단 탭 내비게이션.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LineChart, Megaphone, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/creatives", label: "소재", icon: Sparkles },
  { href: "/simulations", label: "시뮬레이션", icon: LineChart },
  { href: "/campaigns", label: "캠페인", icon: Megaphone },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh md:flex">
      {/* 데스크톱 사이드바 */}
      <aside className="hidden md:flex md:w-56 md:shrink-0 md:flex-col md:border-r md:bg-surface-2">
        <div className="px-5 py-6 text-h3">클릭미</div>
        <nav className="flex flex-col gap-1 px-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(pathname, href)
                  ? "bg-primary-subtle text-primary"
                  : "text-ink-secondary hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* 본문 — 모바일은 하단 내비 높이만큼 패딩 확보 */}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      {/* 모바일 하단 탭 내비 */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-surface-2 pb-[env(safe-area-inset-bottom)] md:hidden">
        <ul className="flex">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 text-xs",
                  isActive(pathname, href) ? "text-primary" : "text-ink-tertiary",
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
