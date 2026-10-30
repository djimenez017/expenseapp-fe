import React from "react";

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
    <div className="rounded-3xl bg-clay px-6 py-5 text-white">
      <p className="text-sm uppercase tracking-widest text-white/80">A year of bills</p>
      <p className="mt-1 text-4xl">${totalPerYear.toFixed(2)}</p>
    </div>
  );
}
