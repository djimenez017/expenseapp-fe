import React from "react";
import { formatDollars } from "../lib/leftover";

export default function Tile({ frequency, amount }) {
  return (
    <div className="bg-white px-4 py-3 sm:px-5 sm:py-4">
      <dt className="text-sm text-muted">{frequency}</dt>
      <dd className="mt-0.5 text-xl font-semibold tabular-nums sm:text-2xl">
        {formatDollars(amount)}
      </dd>
    </div>
  );
}
