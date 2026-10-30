import React from "react";
import Link from "next/link";

export default function button(props) {
  const quiet = props.variant === "quiet";
  const className = quiet
    ? "inline-flex w-full items-center justify-center rounded-full border border-line bg-white px-5 py-3 font-bold text-ink transition hover:border-green"
    : "inline-flex w-full items-center justify-center rounded-full bg-green px-5 py-3 font-bold text-white transition hover:bg-ink";

  return (
    <Link href={`${props.to}`} passHref>
      <button
        as="a"
        className={className}
        type={props.type}
        onClick={props.click}
      >
        {props.children}
      </button>
    </Link>
  );
}
