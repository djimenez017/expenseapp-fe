import React from "react";
import Link from "next/link";

export default function Button({ to, variant, size, wide = true, children }) {
  const quiet = variant === "quiet";
  const compact = size === "compact";
  const className = [
    "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors",
    compact ? "min-h-[40px] px-4 py-2 text-sm" : "min-h-[44px] px-5 py-3",
    wide ? "w-full" : "",
    quiet
      ? "border border-line bg-white text-ink hover:border-green"
      : "bg-green text-white hover:bg-ink",
  ].join(" ");

  return (
    <Link href={`${to}`} className={className}>
      {children}
    </Link>
  );
}
