import React from "react";
import Link from "next/link";
import Button from "../button";
import {
  formatDollars,
  formatLongDate,
  formatShortDate,
  checksThisMonth,
  paycheckBreakdown,
} from "../lib/leftover";
import { scheduleLabel } from "../lib/expenseOptions";

const KIND_LABEL = {
  BILL: "Bill",
  SUBSCRIPTION: "Subscription",
  LOAN: "Loan",
  CREDIT_CARD: "Credit card",
};

function ChargeList({ charges }) {
  if (charges.length === 0) {
    return <p className="text-sm text-muted">No bills on this check.</p>;
  }

  return (
    <ul className="divide-y divide-line">
      {charges.map((charge) => (
        <li key={charge.key} className="flex items-baseline justify-between gap-3 py-2">
          <span>
            <span className="font-bold">{charge.name}</span>
            <span className="mt-0.5 block whitespace-nowrap text-sm text-muted">
              {KIND_LABEL[charge.kind] || "Bill"} · {formatShortDate(charge.dueOn)}
            </span>
          </span>
          <span className="font-bold">{formatDollars(charge.amount)}</span>
        </li>
      ))}
    </ul>
  );
}

function CheckCard({ check, paycheck, featured }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white">
      <div className={featured ? "bg-ink px-5 py-5 text-white" : "px-5 pt-5"}>
        <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-widest">
          <span className={featured ? "text-white/60" : "text-muted"}>
            {featured ? "This paycheck" : "Payday"} · {formatShortDate(check.payday)}
          </span>
          {featured && (
            <Link href="/profile">
              <a className="text-white/80 hover:text-white">Edit</a>
            </Link>
          )}
        </div>
        <p className="mt-2 text-4xl">
          {formatDollars(check.left)}
        </p>
        <p className={`mt-1 text-sm ${featured ? "text-white/70" : "text-muted"}`}>
          left from {formatDollars(paycheck.amount)}
        </p>
        <p className={`text-sm ${featured ? "text-white/70" : "text-muted"}`}>
          {formatShortDate(check.period.start)} – {formatShortDate(check.period.end)}
        </p>
      </div>
      <div className="flex-1 px-5 py-3">
        <ChargeList charges={check.charges} />
      </div>
    </article>
  );
}

export function PaycheckCheck({ paycheck, expenses }) {
  if (!paycheck) return null;

  const breakdown = paycheckBreakdown({ paycheck, expenses });
  if (!breakdown) {
    return (
      <div className="space-y-3">
        <p className="text-muted">Add your next payday to see what is left on this check.</p>
        <Button to="/profile">Add payday</Button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-muted">
        Payday {formatLongDate(breakdown.payday)}
      </p>
      <p className="mt-1 text-4xl">{formatDollars(breakdown.left)}</p>
      <p className="mt-1 text-sm text-muted">left on this check</p>
      <div className="mt-4">
        <ChargeList charges={breakdown.charges} />
      </div>
    </div>
  );
}

export default function PaycheckSummary({ paycheck, summary, expenses }) {
  if (!paycheck) {
    return (
      <div className="panel space-y-3">
        <h2 className="text-2xl">Paychecks</h2>
        <p className="text-muted">Add your take-home pay to see which bills come out of each check.</p>
        <div className="max-w-xs">
          <Button to="/profile">Add paycheck</Button>
        </div>
      </div>
    );
  }

  const checks = checksThisMonth(paycheck, expenses);
  const monthLabel = new Date().toLocaleDateString("en-US", { month: "long" });

  if (checks.length === 0) {
    return (
      <div className="panel space-y-3">
        <h2 className="text-2xl">Paychecks</h2>
        <p className="text-muted">Add your paydays to see which bills come out of each check.</p>
        <div className="max-w-xs">
          <Button to="/profile">Add payday</Button>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div>
          <h2 className="text-2xl">Paychecks</h2>
          <p className="text-sm text-muted">
            {monthLabel} · {scheduleLabel(paycheck.schedule, paycheck)}
          </p>
        </div>
        <div className="flex gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">This month</p>
            <p className="text-2xl">{formatDollars(summary.leftoverMonth)}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">This year</p>
            <p className="text-2xl">{formatDollars(summary.leftoverYear)}</p>
          </div>
        </div>
      </div>
      <div className="grid items-stretch gap-4 sm:grid-cols-2">
        {checks.map((check) => (
          <CheckCard
            key={check.payday.getTime()}
            check={check}
            paycheck={paycheck}
            featured={check.current}
          />
        ))}
      </div>
    </section>
  );
}
