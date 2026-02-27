import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-gold to-[#ff9a47] text-matteBlack shadow-[0_0_0_1px_rgba(20,185,231,0.35)] hover:from-cyan hover:to-gold",
  secondary: "bg-charcoal text-softWhite border border-gold/45 hover:border-cyan/45 hover:bg-charcoal/80",
  ghost: "bg-transparent text-softWhite border border-white/20 hover:border-gold/55 hover:text-gold",
  danger: "bg-red-800/80 text-white hover:bg-red-700"
};

export function Button({ className, variant = "primary", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50",
        "shadow-sm hover:-translate-y-0.5",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
