import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-2xl border border-white/15 bg-charcoal/70 px-4 py-2 text-sm text-softWhite outline-none transition focus:border-cyan/60 focus:ring-2 focus:ring-cyan/20",
        className
      )}
      {...props}
    />
  );
}
