import React from "react";
import Link from "next/link";
import Button from "../button";
import { formatDollars, formatLongDate, paycheckBreakdown } from "../lib/leftover";
import { scheduleLabel } from "../lib/expenseOptions";

function ChargeList({ charges }) {
  if (charges.length === 0) {
    return <p className="text-muted">Nothing is due before this payday.</p>;
  }

  return (
    <ul className="divide-y divide-line">
      {charges.map((charge) => (
        <li key={charge.key} className="flex items-baseline justify-between gap-4 py-2">
          <span>
            {charge.name}
            <span className="mt-0.5 block text-sm text-muted">
              {formatLongDate(charge.dueOn)}
            </span>
          </span>
          <span className="font-bold">{formatDollars(charge.amount)}</span>
        </li>
      ))}
    </ul>
  );
}

export function PaycheckCheck({ paycheck, expenses }) {
  if (!paycheck) return null;

  if (!paycheck.next_payday) {
    return (
      <div className="space-y-3">
        <p className="text-muted">Add your next payday to see what is left on this check.</p>
        <Button to="/paycheck">Add payday</Button>
      </div>
    );
  }

  const breakdown = paycheckBreakdown({ paycheck, expenses });
  if (!breakdown) {
    return <p className="text-muted">Add your next payday to see what is left on this check.</p>;
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
        <h2 className="text-2xl">Paycheck</h2>
        <p className="text-muted">Add your take-home pay to see what is left on the next check.</p>
        <Button to="/paycheck">Add paycheck</Button>
      </div>
    );
  }

  const breakdown = paycheck.next_payday
    ? paycheckBreakdown({ paycheck, expenses })
    : null;

  return (
    <section className="overflow-hidden rounded-3xl border border-line bg-white">
      <div className="bg-ink px-6 py-6 text-white">
        <div className="flex items-center justify-between text-sm">
          <span className="uppercase tracking-widest text-white/60">
            {scheduleLabel(paycheck.schedule)}
          </span>
          <Link href="/paycheck">
            <a className="font-bold text-white/80 hover:text-white">Edit</a>
          </Link>
        </div>
        <p className="mt-3 text-5xl">
          {formatDollars(breakdown ? breakdown.left : paycheck.amount)}
        </p>
        <p className="mt-1 text-white/70">
          {breakdown
            ? `left from ${formatDollars(paycheck.amount)}`
            : "Add a payday to see what this check can cover"}
        </p>
      </div>
      <div className="px-6 py-4">
        {breakdown ? (
          <ChargeList charges={breakdown.charges} />
        ) : (
          <Button to="/paycheck">Add payday</Button>
        )}
      </div>
      <div className="grid grid-cols-2 border-t border-line">
        <div className="px-6 py-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">This month</p>
          <p className="mt-1 text-2xl">{formatDollars(summary.leftoverMonth)}</p>
        </div>
        <div className="border-l border-line px-6 py-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">This year</p>
          <p className="mt-1 text-2xl">{formatDollars(summary.leftoverYear)}</p>
        </div>
      </div>
    </section>
  );
}
