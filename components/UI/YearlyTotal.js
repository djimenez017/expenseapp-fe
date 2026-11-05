import React from "react";
import { formatDollars } from "../lib/leftover";

export default function YearlyTotal({
  dailyAmount,
  weeklyAmount,
  monthlyAmount,
  yearlyAmount,
}) {
  const totalPerYear =
    Number(dailyAmount) * 365 +
    Number(weeklyAmount) * 52 +
    Number(monthlyAmount) * 12 +
    Number(yearlyAmount);
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 bg-ink px-4 py-4 text-white sm:px-5">
      <p className="text-white/80">Bills over a full year</p>
      <p className="text-2xl font-semibold tabular-nums sm:text-3xl">{formatDollars(totalPerYear)}</p>
    </div>
  );
}
