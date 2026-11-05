import React, { useEffect, useState } from "react";
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
    return <p className="py-2 text-sm text-muted">Nothing is due from this check.</p>;
  }

  return (
    <ul className="divide-y divide-line">
      {charges.map((charge) => (
        <li key={charge.key} className="flex items-baseline justify-between gap-3 py-2.5">
          <span className="min-w-0">
            <span className="block truncate font-semibold">{charge.name}</span>
            <span className="block text-sm text-muted">
              {KIND_LABEL[charge.kind] || "Bill"} · {formatShortDate(charge.dueOn)}
            </span>
          </span>
          <span className="shrink-0 font-semibold tabular-nums">{formatDollars(charge.amount)}</span>
        </li>
      ))}
    </ul>
  );
}

function Chevron({ open }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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
  );
}

function SpendingTotal({ amount, count }) {
  if (!amount) return null;
  return (
    <div className="flex items-baseline justify-between gap-3 border-t border-line py-2.5 text-sm">
      <span className="min-w-0">
        <span className="block font-semibold">Spending</span>
        <span className="block text-muted">
          {count} {count === 1 ? "purchase" : "purchases"} since this paycheck
        </span>
      </span>
      <span className="shrink-0 font-semibold tabular-nums">{formatDollars(amount)}</span>
    </div>
  );
}

function DueToggle({ check, open, onToggle, id }) {
  const count = check.charges.length;
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={id}
      onClick={onToggle}
      className="flex min-h-[44px] w-full items-center justify-between gap-3 text-left text-sm"
    >
      <span className="text-muted">
        {count === 0 ? "Nothing due" : `${count} ${count === 1 ? "payment" : "payments"} due`}
      </span>
      <span className="flex items-center gap-2 font-semibold tabular-nums text-ink">
        {formatDollars(check.due)}
        <Chevron open={open} />
      </span>
    </button>
  );
}

function CurrentCheck({ check, paycheck }) {
  const [open, setOpen] = useState(false);
  const listId = `charges-${check.payday.getTime()}`;

  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) setOpen(true);
  }, []);

  return (
    <div>
      <div className="bg-ink px-4 py-5 text-white sm:px-5">
        <div className="flex items-center justify-between gap-3 text-sm">
          <h2 className="font-semibold text-white/80">Paycheck on {formatShortDate(check.received)}</h2>
          <Link href="/profile">
            <a className="rounded-full px-2 py-1 font-bold text-white/80 hover:bg-white/10 hover:text-white">
              Edit
            </a>
          </Link>
        </div>
        <p className="mt-1 text-4xl font-semibold tabular-nums">{formatDollars(check.left)}</p>
        <p className="mt-1 text-sm text-white/70">
          left of {formatDollars(paycheck.amount)} · until {formatShortDate(check.payday)}
        </p>
      </div>
      <div className="px-4 sm:px-5">
        <DueToggle check={check} open={open} onToggle={() => setOpen(!open)} id={listId} />
        {open && (
          <div id={listId} className="border-t border-line pb-2">
            <ChargeList charges={check.charges} />
          </div>
        )}
        <SpendingTotal amount={check.spending} count={check.spendingCount} />
      </div>
    </div>
  );
}

function OtherCheck({ check }) {
  const [open, setOpen] = useState(false);
  const listId = `charges-${check.payday.getTime()}`;

  return (
    <div className="border-t border-line px-4 sm:px-5">
      <div className="flex items-baseline justify-between gap-3 pt-3">
        <h3 className="text-sm font-semibold text-ink">
          Paycheck on {formatShortDate(check.received)}
          <span className="mt-0.5 block font-normal text-muted">
            until {formatShortDate(check.payday)}
          </span>
        </h3>
        <p className="font-semibold tabular-nums">
          {formatDollars(check.left)} <span className="text-sm font-normal text-muted">left</span>
        </p>
      </div>
      <DueToggle check={check} open={open} onToggle={() => setOpen(!open)} id={listId} />
      {open && (
        <div id={listId} className="border-t border-line pb-2">
          <ChargeList charges={check.charges} />
        </div>
      )}
      <SpendingTotal amount={check.spending} count={check.spendingCount} />
    </div>
  );
}

export function PaycheckCheck({ paycheck, expenses, spending }) {
  if (!paycheck) return null;

  const breakdown = paycheckBreakdown({ paycheck, expenses, spending });
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
      <h2 className="text-sm font-semibold text-muted">
        Paycheck on {formatLongDate(breakdown.received)}
      </h2>
      <p className="mt-1 text-4xl font-semibold tabular-nums">{formatDollars(breakdown.left)}</p>
      <p className="mt-1 text-sm text-muted">left until {formatShortDate(breakdown.payday)}</p>
      <div className="mt-4">
        <ChargeList charges={breakdown.charges} />
        <SpendingTotal amount={breakdown.spending} count={breakdown.spendingCount} />
      </div>
    </div>
  );
}

function SetupPrompt({ text, action }) {
  return (
    <section className="panel space-y-3">
      <h2 className="text-lg font-semibold">Paychecks</h2>
      <p className="text-sm text-muted">{text}</p>
      <Button to="/profile" size="compact" wide={false}>
        {action}
      </Button>
    </section>
  );
}

export default function PaycheckSummary({ paycheck, summary, expenses, spending = [] }) {
  if (!paycheck) {
    return (
      <SetupPrompt
        text="Add your take-home pay to see which bills come out of each check."
        action="Add paycheck"
      />
    );
  }

  const checks = checksThisMonth(paycheck, expenses, new Date(), spending);
  const now = new Date();
  const monthLabel = now.toLocaleDateString("en-US", { month: "long" });

  if (checks.length === 0) {
    return (
      <SetupPrompt
        text="Add your paydays to see which bills come out of each check."
        action="Add payday"
      />
    );
  }

  const current = checks.find((check) => check.current) || checks[0];
  const others = checks.filter((check) => check !== current);

  return (
    <section
      aria-label="Paychecks"
      className="overflow-hidden rounded-2xl border border-line bg-white"
    >
      <CurrentCheck check={current} paycheck={paycheck} />
      {others.map((check) => (
        <OtherCheck key={check.payday.getTime()} check={check} />
      ))}
      <dl className="grid grid-cols-2 border-t border-line bg-paper/40">
        <div className="px-4 py-3 sm:px-5">
          <dt className="text-sm text-muted">Left in {monthLabel}</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">{formatDollars(summary.leftoverMonth)}</dd>
        </div>
        <div className="border-l border-line px-4 py-3 sm:px-5">
          <dt className="text-sm text-muted">Left in {now.getFullYear()}</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">{formatDollars(summary.leftoverYear)}</dd>
        </div>
      </dl>
      <p className="border-t border-line px-4 py-2.5 text-xs text-muted sm:px-5">
        Paid {scheduleLabel(paycheck.schedule, paycheck).toLowerCase()}
      </p>
    </section>
  );
}
