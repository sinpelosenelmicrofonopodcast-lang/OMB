"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  href?: string;
  className?: string;
  imageClassName?: string;
  width: number;
  height: number;
  priority?: boolean;
};

export function BrandLogo({
  href = "/",
  className,
  imageClassName,
  width,
  height,
  priority = false
}: BrandLogoProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <Link href={href} className={cn("inline-flex items-center", className)}>
      {!hasError ? (
        <Image
          src="/omb-auto-sales-logo.png"
          alt="OMB AUTO SALES"
          width={width}
          height={height}
          className={cn("h-auto w-auto object-contain", imageClassName)}
          priority={priority}
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="font-heading text-2xl text-softWhite">
          <span className="bg-gradient-to-r from-cyan to-gold bg-clip-text text-transparent">OMB</span> AUTO SALES
        </span>
      )}
    </Link>
  );
}
