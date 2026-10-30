import React from "react";

export default function Tile({ frequency, amount }) {
  return (
    <div className="min-w-[9rem] flex-1 rounded-2xl border border-line bg-white px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-widest text-muted">{frequency}</p>
      <p className="mt-1 text-2xl">${amount}</p>
    </div>
  );
}
