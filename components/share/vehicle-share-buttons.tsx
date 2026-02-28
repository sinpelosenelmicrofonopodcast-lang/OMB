"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ShareLabels = {
  share: string;
  facebook: string;
  copied: string;
  copyError: string;
};

type ShareVehicleButtonsProps = {
  title: string;
  path: string;
  labels: ShareLabels;
  compact?: boolean;
  className?: string;
};

function toAbsoluteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;

  if (typeof window !== "undefined") {
    return new URL(path, window.location.origin).toString();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (baseUrl) {
    try {
      return new URL(path, baseUrl).toString();
    } catch {
      return path;
    }
  }

  return path;
}

export function ShareVehicleButtons({ title, path, labels, compact = false, className }: ShareVehicleButtonsProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function scheduleReset() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus("idle"), 1800);
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
      scheduleReset();
    } catch {
      setStatus("error");
      scheduleReset();
    }
  }

  async function handleShare() {
    const url = toAbsoluteUrl(path);

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }

    await copyUrl(url);
  }

  function handleFacebook() {
    const url = toAbsoluteUrl(path);
    const target = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(target, "_blank", "noopener,noreferrer");
  }

  const buttonBase = compact ? "rounded-lg px-2.5 py-1 text-xs" : "rounded-xl px-3.5 py-2 text-sm";

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <button
        type="button"
        onClick={handleFacebook}
        className={cn(
          buttonBase,
          "border border-gold/45 text-gold transition hover:border-gold hover:bg-gold/10"
        )}
      >
        {labels.facebook}
      </button>
      <button
        type="button"
        onClick={handleShare}
        className={cn(
          buttonBase,
          "border border-cyan/45 text-cyan transition hover:border-cyan hover:bg-cyan/10"
        )}
      >
        {status === "copied" ? labels.copied : status === "error" ? labels.copyError : labels.share}
      </button>
    </div>
  );
}
