import { cn } from "@/lib/utils";

type BadgeProps = {
  children: string;
  tone?: "default" | "success" | "warning" | "muted";
};

const toneClasses = {
  default: "bg-gold/18 text-gold border-gold/45",
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-400/40",
  warning: "bg-amber-500/15 text-amber-300 border-amber-400/40",
  muted: "bg-white/10 text-softWhite border-white/20"
};

export function Badge({ children, tone = "default" }: BadgeProps) {
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-medium", toneClasses[tone])}>
      {children}
    </span>
  );
}
