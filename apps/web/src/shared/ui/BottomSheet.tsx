// 모바일 우선 바텀시트. Sheet(side="bottom")에 둥근 상단·그랩 핸들·safe-area 패딩을 더한 래퍼.
"use client";

import * as React from "react";

import { cn } from "@/shared/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./Sheet";

const BottomSheet = Sheet;
const BottomSheetTrigger = SheetTrigger;
const BottomSheetClose = SheetClose;
const BottomSheetHeader = SheetHeader;
const BottomSheetFooter = SheetFooter;
const BottomSheetTitle = SheetTitle;
const BottomSheetDescription = SheetDescription;

const BottomSheetContent = React.forwardRef<
  React.ElementRef<typeof SheetContent>,
  Omit<React.ComponentPropsWithoutRef<typeof SheetContent>, "side">
>(({ className, children, ...props }, ref) => (
  <SheetContent
    ref={ref}
    side="bottom"
    className={cn(
      "max-h-[85dvh] overflow-y-auto rounded-t-2xl pb-[max(1.5rem,env(safe-area-inset-bottom))]",
      className,
    )}
    {...props}
  >
    <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line-strong" aria-hidden />
    {children}
  </SheetContent>
));
BottomSheetContent.displayName = "BottomSheetContent";

export {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetFooter,
  BottomSheetTitle,
  BottomSheetDescription,
};
