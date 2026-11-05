import React from "react";
import Button from "../button";
import { formatDollars } from "../lib/leftover";

function Row({ label, value, strong }) {
  return (
    <div className={`flex items-baseline justify-between gap-4 py-2 ${strong ? "border-t border-line pt-3" : ""}`}>
      <span className={strong ? "font-bold" : "text-muted"}>{label}</span>
      <span className={`tabular-nums ${strong ? "text-xl font-semibold" : "font-bold"}`}>
        {formatDollars(value)}
      </span>
    </div>
  );
}

export default function LeftoverSummary({ paycheck, summary }) {
  return (
    <div className="panel">
      <h2 className="text-lg font-semibold">Month and year</h2>
      <div className="mt-3">
        <Row label="Monthly bills" value={summary.billsMonth} />
        <Row label="Spending this month" value={summary.spendMonth} />
        <Row label="Yearly bills" value={summary.billsYear} />
        <Row label="Spending this year" value={summary.spendYear} />
      </div>
      {paycheck ? (
        <div className="mt-2">
          <Row label="Monthly income" value={summary.incomeMonth} />
          <Row label="Yearly income" value={summary.incomeYear} />
          <Row label="Left this month" value={summary.leftoverMonth} strong />
          <Row label="Left this year" value={summary.leftoverYear} strong />
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <p className="text-muted">Add your paycheck to see what is left each month and year.</p>
          <Button to="/profile">Add paycheck</Button>
        </div>
      )}
    </div>
  );
}
