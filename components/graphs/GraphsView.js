import { useState } from "react";
import Button from "../button";
import {
  currentCheckSplit,
  formatDollars,
  formatShortDate,
  payPeriodKey,
  payPeriodLabel,
  payPeriods,
  payPeriodsWithSpending,
  spendingByCategory,
  spendingByPeriod,
  spendingForPeriod,
} from "../lib/leftover";
import { BarRows, PeriodBars } from "./charts";

const PAYMENT_ROWS = [
  { kind: "BILL", name: "Bills", barClass: "bg-ink" },
  { kind: "SUBSCRIPTION", name: "Subscriptions", barClass: "bg-clay" },
  { kind: "LOAN", name: "Loans", barClass: "bg-green" },
  { kind: "CREDIT_CARD", name: "Credit cards", barClass: "bg-[#9cbfa8]" },
];

function paycheckRows(split) {
  const payments = PAYMENT_ROWS.map((row) => ({
    name: row.name,
    amount: split.byKind[row.kind] || 0,
    barClass: row.barClass,
  })).filter((row) => row.amount > 0);

  const rows = [...payments, { name: "Spending", amount: split.spending, barClass: "bg-muted" }];
  if (split.sent > 0) rows.push({ name: "Sent", amount: split.sent, barClass: "bg-clay" });
  return rows;
}

function categoryPeriods(paycheck, spending) {
  const withSpending = payPeriodsWithSpending(paycheck, spending);
  const [current] = payPeriods(paycheck, 1);
  if (!current) return withSpending;
  if (withSpending.some((period) => payPeriodKey(period) === payPeriodKey(current))) {
    return withSpending;
  }
  return [current, ...withSpending];
}

function PeriodSelect({ periods, value, onChange }) {
  const current = periods.find((period) => period.current) || periods[0];
  const selected = value || payPeriodKey(current);
  const narrowed = selected !== payPeriodKey(current);

  return (
    <label className="relative shrink-0">
      <span className="sr-only">Pay period</span>
      <select
        value={selected}
        onChange={(event) => onChange(event.target.value)}
        className={`min-h-[36px] min-w-[16.5rem] appearance-none rounded-full py-1 pl-3 pr-8 text-sm font-bold outline-none ${
          narrowed ? "bg-ink text-paper" : "bg-white text-ink ring-1 ring-inset ring-line"
        }`}
      >
        {periods.map((period) => (
          <option key={payPeriodKey(period)} value={payPeriodKey(period)}>
            {payPeriodLabel(period)}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className={`pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 ${
          narrowed ? "text-paper" : "text-muted"
        }`}
      >
        <path
          d="M4 6l4 4 4-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </label>
  );
}

export default function GraphsView({ expenses, paycheck, spending, transfers = [] }) {
  const [periodKey, setPeriodKey] = useState("");
  const periods = categoryPeriods(paycheck, spending);
  const current = periods.find((period) => period.current) || periods[0];
  const selected = periods.find((period) => payPeriodKey(period) === periodKey) || current;
  const categories = selected ? spendingByCategory(spendingForPeriod(spending, selected)) : [];
  const periodBars = spendingByPeriod(paycheck, spending);
  const split = currentCheckSplit({ paycheck, expenses, spending, transfers });

  return (
    <div className="space-y-5">
      <section className="panel space-y-4" aria-labelledby="paycheck-split">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id="paycheck-split" className="text-lg font-semibold">
            Where this paycheck goes
          </h2>
          {split && (
            <p className={`text-2xl font-semibold tabular-nums ${split.left < 0 ? "text-danger" : ""}`}>
              {formatDollars(split.left)}
              <span className="ml-2 text-sm font-semibold text-muted">left</span>
            </p>
          )}
        </div>
        {!paycheck && (
          <div className="space-y-3">
            <p className="text-sm text-muted">Add your paycheck to see where it goes.</p>
            <Button to="/profile" size="compact" wide={false}>
              Add paycheck
            </Button>
          </div>
        )}
        {paycheck && !split && (
          <div className="space-y-3">
            <p className="text-sm text-muted">Add your paydays to see where this check goes.</p>
            <Button to="/profile" size="compact" wide={false}>
              Add payday
            </Button>
          </div>
        )}
        {split && (
          <>
            <p className="text-sm text-muted">
              Paycheck on {formatShortDate(split.received)}, until {formatShortDate(split.payday)}
            </p>
            <BarRows scale={split.amount} items={paycheckRows(split)} />
          </>
        )}
      </section>

      <section className="panel space-y-4" aria-labelledby="spending-category">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="spending-category" className="text-lg font-semibold">
            Spending by category
          </h2>
          {periods.length > 0 && (
            <PeriodSelect periods={periods} value={periodKey} onChange={setPeriodKey} />
          )}
        </div>
        {!paycheck && (
          <p className="text-sm text-muted">Add your paycheck to group purchases by pay period.</p>
        )}
        {paycheck && categories.length === 0 && (
          <p className="text-sm text-muted">No purchases in this pay period.</p>
        )}
        {categories.length > 0 && (
          <BarRows items={categories.map((item) => ({ name: item.name, amount: item.amount }))} />
        )}
      </section>

      <section className="panel space-y-4" aria-labelledby="spending-periods">
        <h2 id="spending-periods" className="text-lg font-semibold">
          Spending by pay period
        </h2>
        {periodBars.length === 0 ? (
          <p className="text-sm text-muted">Log a purchase to see spending by pay period.</p>
        ) : (
          <PeriodBars items={periodBars} />
        )}
      </section>
    </div>
  );
}
