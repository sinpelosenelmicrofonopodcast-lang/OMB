import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-2xl border border-white/15 bg-charcoal/70 px-4 py-3 text-sm text-softWhite outline-none transition focus:border-cyan/60 focus:ring-2 focus:ring-cyan/20",
        className
      )}
      {...props}
    />
  );
}
