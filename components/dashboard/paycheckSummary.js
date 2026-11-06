import React, { useEffect, useRef, useState } from "react";
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

function InfoIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
      <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7.25V11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.8" fill="currentColor" />
    </svg>
  );
}

const HINT_EVENT = "paycheck-hint-open";

function Hint({ id, label, children, tone = "light", placement = "below", align = "start", compact = false }) {
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState(null);
  const buttonRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const onOther = (event) => {
      if (event.detail !== id) setOpen(false);
    };
    window.addEventListener(HINT_EVENT, onOther);
    return () => window.removeEventListener(HINT_EVENT, onOther);
  }, [id]);

  const place = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.min(256, window.innerWidth - 24);
    let left = align === "end" ? rect.right - width : rect.left;
    left = Math.max(12, Math.min(left, window.innerWidth - width - 12));
    if (placement === "above") {
      setStyle({ position: "fixed", left, width, top: rect.top - 8, transform: "translateY(-100%)" });
    } else {
      setStyle({ position: "fixed", left, width, top: rect.bottom + 8 });
    }
  };

  useEffect(() => {
    if (!open) return undefined;
    place();
    const onPointerDown = (event) => {
      const target = event.target;
      if (buttonRef.current?.contains(target) || tooltipRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, align, placement]);

  return (
    <span className="inline-flex">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={label}
        onClick={() => {
          if (open) {
            setOpen(false);
            return;
          }
          window.dispatchEvent(new CustomEvent(HINT_EVENT, { detail: id }));
          place();
          setOpen(true);
        }}
        className={`inline-flex shrink-0 items-center justify-center rounded-full ${
          compact ? "h-6 w-6" : "h-8 w-8"
        } ${
          tone === "inverse" ? "text-white/80 hover:bg-white/10 hover:text-white" : "text-muted hover:bg-paper hover:text-ink"
        }`}
      >
        <InfoIcon />
      </button>
      {open && (
        <span
          ref={tooltipRef}
          id={id}
          role="tooltip"
          style={style}
          className="z-50 rounded-xl border border-line bg-white p-3 text-left text-sm font-normal leading-snug text-ink shadow-lg"
        >
          {children}
        </span>
      )}
    </span>
  );
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function checkExplanation(check) {
  const from = formatShortDate(check.received);
  const until = formatShortDate(check.payday);
  const future = startOfDay(check.received) > startOfDay(new Date());
  const spending = check.spending ? ` and purchases logged since ${from}` : "";
  return `This paycheck ${future ? "arrives" : "arrived"} on ${from} and lasts until ${until}. The amount left is the paycheck minus bills due before ${until}${spending}.`;
}

function monthPayPhrase(schedule) {
  if (schedule === "SEMIMONTHLY") return "Two paychecks";
  if (schedule === "MONTHLY") return "One paycheck";
  if (schedule === "WEEKLY") return "About four paychecks";
  if (schedule === "BIWEEKLY") return "About two paychecks";
  return "A month of pay";
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

function SpendingTotal({ id, amount, count }) {
  if (!amount) return null;
  return (
    <div className="flex items-baseline justify-between gap-3 border-t border-line py-2.5 text-sm">
      <span className="min-w-0">
        <span className="flex items-center">
          <span className="font-semibold">Spending</span>
          <Hint id={id} label="What spending means">
            Purchases logged since this paycheck, added into one total.
          </Hint>
        </span>
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
        <p className="mt-1 flex items-center text-sm text-white/70">
          <span>
            left of {formatDollars(paycheck.amount)} · until {formatShortDate(check.payday)}
          </span>
          <Hint
            id={`paycheck-${check.payday.getTime()}`}
            label="What this paycheck means"
            tone="inverse"
          >
            {checkExplanation(check)}
          </Hint>
        </p>
      </div>
      <div className="px-4 sm:px-5">
        <div className="flex items-center">
          <Hint id={`payments-${check.payday.getTime()}`} label="What payments due means">
            Bills that come out of this paycheck. Open the row to see each one.
          </Hint>
          <div className="min-w-0 flex-1">
            <DueToggle check={check} open={open} onToggle={() => setOpen(!open)} id={listId} />
          </div>
        </div>
        {open && (
          <div id={listId} className="border-t border-line pb-2">
            <ChargeList charges={check.charges} />
          </div>
        )}
        <SpendingTotal
          id={`spending-${check.payday.getTime()}`}
          amount={check.spending}
          count={check.spendingCount}
        />
      </div>
    </div>
  );
}

function OtherCheck({ check }) {
  const [open, setOpen] = useState(false);
  const listId = `charges-${check.payday.getTime()}`;

  return (
    <div className="border-t border-[#c9ddd0] bg-[#e7f2eb] px-4 sm:px-5">
      <div className="flex items-baseline justify-between gap-3 pt-3">
        <div className="min-w-0">
          <div className="flex items-center">
            <h3 className="text-sm font-semibold text-green">
              Paycheck on {formatShortDate(check.received)}
            </h3>
            <Hint id={`paycheck-${check.payday.getTime()}`} label="What this paycheck means">
              {checkExplanation(check)}
            </Hint>
          </div>
          <p className="text-sm text-muted">until {formatShortDate(check.payday)}</p>
        </div>
        <p className="font-semibold tabular-nums text-green">
          {formatDollars(check.left)} <span className="text-sm font-normal text-muted">left</span>
        </p>
      </div>
      <div className="flex items-center">
        <Hint id={`payments-${check.payday.getTime()}`} label="What payments due means">
          Bills that come out of this paycheck. Open the row to see each one.
        </Hint>
        <div className="min-w-0 flex-1">
          <DueToggle check={check} open={open} onToggle={() => setOpen(!open)} id={listId} />
        </div>
      </div>
      {open && (
        <div id={listId} className="border-t border-line pb-2">
          <ChargeList charges={check.charges} />
        </div>
      )}
      <SpendingTotal
        id={`spending-${check.payday.getTime()}`}
        amount={check.spending}
        count={check.spendingCount}
      />
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
      <div className="flex items-center">
        <h2 className="text-sm font-semibold text-muted">
          Paycheck on {formatLongDate(breakdown.received)}
        </h2>
        <Hint id="details-paycheck" label="What this paycheck means">
          {checkExplanation(breakdown)}
        </Hint>
      </div>
      <p className="mt-1 text-4xl font-semibold tabular-nums">{formatDollars(breakdown.left)}</p>
      <p className="mt-1 text-sm text-muted">left until {formatShortDate(breakdown.payday)}</p>
      <div className="mt-4">
        <ChargeList charges={breakdown.charges} />
        <SpendingTotal
          id="details-spending"
          amount={breakdown.spending}
          count={breakdown.spendingCount}
        />
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
          <dt className="flex items-start text-sm text-muted">
            <span className="pt-0.5">Left in {monthLabel}</span>
            <Hint id="left-month" label="What left this month means" placement="above" compact>
              {monthPayPhrase(paycheck.schedule)}, minus your usual bills for a month, minus purchases logged in {monthLabel}.
            </Hint>
          </dt>
          <dd className="font-semibold tabular-nums">{formatDollars(summary.leftoverMonth)}</dd>
        </div>
        <div className="border-l border-line px-4 py-3 sm:px-5">
          <dt className="flex items-start text-sm text-muted">
            <span className="pt-0.5">Left in {now.getFullYear()}</span>
            <Hint id="left-year" label="What left this year means" placement="above" align="end" compact>
              Every paycheck in {now.getFullYear()}, minus your bills for the whole year, minus purchases logged in {now.getFullYear()}.
            </Hint>
          </dt>
          <dd className="font-semibold tabular-nums">{formatDollars(summary.leftoverYear)}</dd>
        </div>
      </dl>
      <p className="border-t border-line px-4 py-2.5 text-xs text-muted sm:px-5">
        Paid {scheduleLabel(paycheck.schedule, paycheck).toLowerCase()}
      </p>
    </section>
  );
}
