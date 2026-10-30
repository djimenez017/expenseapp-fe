import React from "react";

export default function Submit({ children = "Save" }) {
  return (
    <button
      type="submit"
      value="submit"
      className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-green px-5 py-3 font-bold text-white transition hover:bg-ink"
    >
      {children}
    </button>
  );
}
