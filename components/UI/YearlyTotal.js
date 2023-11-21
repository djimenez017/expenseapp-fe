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
    <div className="p-4 space-y-4 mb-10 bg-orange text-white text-xl text-center">
      Your Total Yearly Amount is:{" "}
      <span className="text-bold">${totalPerYear.toFixed(2)}</span>
    </div>
  );
}
