// shadcn/ui 표준 클래스 병합 헬퍼 — 조건부 클래스(clsx) + Tailwind 충돌 해소(tailwind-merge).
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
