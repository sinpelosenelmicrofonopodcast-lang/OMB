import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gold/30 bg-gradient-to-b from-[#1b130f] via-charcoal to-[#0a1017] p-6 shadow-luxe transition duration-300 hover:-translate-y-1 hover:border-cyan/45 hover:shadow-glow",
        className
      )}
    >
      {children}
    </div>
  );
}
