import React, { useEffect, useState } from "react";
import Link from "next/link";
import ExpenseRow from "./expenses/expenseCard";
import Loading from "./UI/Loading";
import PaycheckSummary from "./dashboard/paycheckSummary";
import SpendingLog from "./dashboard/spendingLog";
import { supabase } from "./lib/supabase";
import {
  dueThisMonth,
  formatDollars,
  isInMonth,
  leftoverSummary,
  payPeriodKey,
  payPeriodLabel,
  payPeriodsWithSpending,
  spendingForPeriod,
} from "./lib/leftover";
import {
  EXPENSE_FREQUENCIES,
  RECOMMENDED_UTILIZATION,
  aboveRecommendedUse,
  combinedUtilization,
  filterByFrequency,
  formatUtilization,
} from "./lib/expenseOptions";
import { collectTags, hasTag, loadExpenses, loadSpending } from "./lib/tags";

const TABS = [
  { id: "subscriptions", label: "Subscriptions", empty: "Nothing renews this month." },
  { id: "bills", label: "Bills", empty: "No bills yet." },
  { id: "loans", label: "Loans", empty: "No loans yet." },
  { id: "creditCards", label: "Credit cards", empty: "No credit cards yet." },
  { id: "spending", label: "Spending" },
];

function EmptyList({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-line px-4 py-8 text-center">
      <p className="text-sm text-muted">{text}</p>
      <Link href="/addExpense">
        <a className="mt-2 inline-block text-sm font-bold text-green hover:text-ink">Add an expense</a>
      </Link>
    </div>
  );
}

function ExpenseList({ expenses, onChanged, onTagSelect, showKind, empty }) {
  if (expenses.length === 0) return <EmptyList text={empty || "Nothing here yet."} />;

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
      {expenses.map((expense) => (
        <ExpenseRow
          key={expense.id}
          expense={expense}
          showKind={showKind}
          onTagSelect={onTagSelect}
          onChanged={onChanged}
        />
      ))}
    </ul>
  );
}

function Chip({ selected, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`min-h-[36px] whitespace-nowrap rounded-full px-3 text-sm font-bold transition-colors ${
        selected ? "bg-ink text-paper" : "bg-white text-muted ring-1 ring-inset ring-line hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function scheduleInList(expenses, frequency) {
  if (!frequency) return "";
  return expenses.some((expense) => expense.frequency === frequency) ? frequency : "";
}

function FrequencyFilter({ expenses, value, onChange }) {
  const present = EXPENSE_FREQUENCIES.map((item) => ({
    value: item.value,
    label: item.label,
    count: expenses.filter((expense) => expense.frequency === item.value).length,
  })).filter((item) => item.count > 0);

  if (present.length < 2) return null;

  const options = [{ value: "", label: "All", count: expenses.length }, ...present];

  return (
    <div className="flex gap-2" role="group" aria-label="Filter by schedule">
      {options.map((item) => (
        <Chip
          key={item.value || "all"}
          selected={(value || "") === item.value}
          onClick={() => onChange(item.value)}
        >
          {item.label}
          <span className="ml-1.5 font-normal opacity-70">{item.count}</span>
        </Chip>
      ))}
    </div>
  );
}

function PayPeriodSelect({ periods, value, onChange }) {
  if (periods.length === 0) return null;
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

function TagSelect({ tags, value, onChange }) {
  if (tags.length === 0) return null;

  return (
    <label className="relative shrink-0">
      <span className="sr-only">Filter by tag</span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        className={`min-h-[36px] appearance-none rounded-full py-1 pl-3 pr-8 text-sm font-bold outline-none ${
          value ? "bg-ink text-paper" : "bg-white text-muted ring-1 ring-inset ring-line"
        }`}
      >
        <option value="">All tags</option>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.name}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className={`pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 ${
          value ? "text-paper" : "text-muted"
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

function Toolbar({ filters, trailing }) {
  return (
    <div className="flex items-center gap-2">
      <div className="scroll-strip -ml-4 min-w-0 flex-1 overflow-x-auto pl-4 sm:ml-0 sm:pl-0">
        {filters}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
}

function CreditUtilization({ cards }) {
  const summary = combinedUtilization(cards);
  if (!summary) {
    if (cards.length === 0) return null;
    return (
      <p className="rounded-2xl border border-dashed border-line px-4 py-3 text-sm text-muted">
        Add a credit limit to a card to see how much of your credit you are using.
      </p>
    );
  }

  const high = aboveRecommendedUse(summary.rate);
  const width = Math.min(100, summary.rate * 100);
  const target = Math.round(RECOMMENDED_UTILIZATION * 100);

  return (
    <div className="rounded-2xl border border-line bg-white px-4 py-4 sm:px-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-semibold">Credit utilization</h3>
        <p className={`text-2xl font-semibold tabular-nums ${high ? "text-danger" : "text-green"}`}>
          {formatUtilization(summary.rate)}
        </p>
      </div>
      <div
        className="relative mt-3 h-2 overflow-hidden rounded-full bg-paper"
        role="img"
        aria-label={`${formatUtilization(summary.rate)} of your total limit is in use`}
      >
        <div
          className={`h-full rounded-full ${high ? "bg-danger" : "bg-green"}`}
          style={{ width: `${width}%` }}
        />
        <span
          className="absolute inset-y-0 w-px bg-ink/40"
          style={{ left: `${target}%` }}
          aria-hidden="true"
        />
      </div>
      <p className="mt-2 text-sm text-muted">
        <span className={`font-bold ${high ? "text-danger" : "text-green"}`}>
          {high ? `Above the ${target}% mark` : `Under the ${target}% mark`}
        </span>{" "}
        · {formatDollars(summary.balance)} of {formatDollars(summary.limit)}
      </p>
    </div>
  );
}

function ExpenseTabs({ expenses, monthSpending, spending, paycheck, onChanged }) {
  const [tab, setTab] = useState("subscriptions");
  const [tagId, setTagId] = useState(null);
  const [frequency, setFrequency] = useState("");
  const [periodKey, setPeriodKey] = useState("");
  const periods = payPeriodsWithSpending(paycheck, spending);
  const currentPeriod = periods.find((period) => period.current) || periods[0];
  const selectedPeriod =
    periods.find((period) => payPeriodKey(period) === periodKey) || currentPeriod;
  const periodSpending = selectedPeriod ? spendingForPeriod(spending, selectedPeriod) : monthSpending;
  const groups = {
    subscriptions: expenses.filter(
      (expense) => expense.kind === "SUBSCRIPTION" && dueThisMonth(expense)
    ),
    bills: expenses.filter((expense) => !expense.kind || expense.kind === "BILL"),
    loans: expenses.filter((expense) => expense.kind === "LOAN"),
    creditCards: expenses.filter((expense) => expense.kind === "CREDIT_CARD"),
  };
  const counts = {
    ...Object.fromEntries(Object.entries(groups).map(([key, value]) => [key, value.length])),
    spending: periodSpending.length,
  };
  const tags = collectTags([expenses, spending]);
  const selectedTag = tags.find((tag) => tag.id === tagId) || null;

  const chooseTab = (id) => {
    setTagId(null);
    setTab(id);
  };

  const chooseTag = (tag) => {
    setTagId((current) => (current === tag.id ? null : tag.id));
  };

  const listed = selectedTag
    ? expenses.filter((expense) => hasTag(expense, selectedTag.id))
    : groups[tab] || [];
  const taggedSpending = selectedTag ? spending.filter((item) => hasTag(item, selectedTag.id)) : [];
  const activeFrequency = scheduleInList(listed, frequency);
  const visible = filterByFrequency(listed, activeFrequency);
  const frequencyLabel =
    EXPENSE_FREQUENCIES.find((item) => item.value === activeFrequency)?.label.toLowerCase() || "";
  const showFilters = tab !== "spending" || selectedTag;
  const activeTab = TABS.find((item) => item.id === tab);

  return (
    <section aria-label="Expenses" className="min-w-0 space-y-4">
      <div
        role="tablist"
        aria-label="Expense type"
        className="scroll-strip -mx-4 flex gap-1 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0"
      >
        {TABS.map((item) => {
          const selected = !selectedTag && tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => chooseTab(item.id)}
              className={`-mb-px min-h-[44px] whitespace-nowrap border-b-2 px-3 text-sm font-bold transition-colors sm:px-4 ${
                selected ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {item.label}
              <span className="ml-1.5 font-normal text-muted">{counts[item.id]}</span>
            </button>
          );
        })}
      </div>

      {(showFilters || tags.length > 0 || (tab === "spending" && periods.length > 0)) && (
        <Toolbar
          filters={
            !selectedTag && tab === "spending" && periods.length > 0 ? (
              <PayPeriodSelect periods={periods} value={periodKey} onChange={setPeriodKey} />
            ) : (
              showFilters && (
                <FrequencyFilter expenses={listed} value={activeFrequency} onChange={setFrequency} />
              )
            )
          }
          trailing={
            tags.length > 0 && (
              <TagSelect tags={tags} value={selectedTag?.id} onChange={setTagId} />
            )
          }
        />
      )}

      <div role="tabpanel" className="space-y-4">
        {selectedTag && (
          <>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-semibold">Tagged {selectedTag.name}</h2>
              <button
                type="button"
                onClick={() => setTagId(null)}
                className="text-sm font-bold text-green hover:text-ink"
              >
                Back to {activeTab?.label}
              </button>
            </div>
            {listed.length === 0 && taggedSpending.length === 0 && (
              <EmptyList text={`Nothing is tagged ${selectedTag.name}.`} />
            )}
            {listed.length > 0 && visible.length === 0 && (
              <p className="text-sm text-muted">No {frequencyLabel} expenses with this tag.</p>
            )}
            {visible.length > 0 && (
              <ExpenseList
                expenses={visible}
                onChanged={onChanged}
                onTagSelect={chooseTag}
                showKind
              />
            )}
            {!activeFrequency && taggedSpending.length > 0 && (
              <SpendingLog
                items={taggedSpending}
                onChanged={onChanged}
                onTagSelect={chooseTag}
                hideHeading
                hideForm
                showKind
              />
            )}
          </>
        )}

        {!selectedTag && tab === "creditCards" && <CreditUtilization cards={groups.creditCards} />}

        {!selectedTag && tab !== "spending" && (
          <>
            {listed.length > 0 && visible.length === 0 ? (
              <p className="text-sm text-muted">No {frequencyLabel} expenses.</p>
            ) : (
              <ExpenseList
                expenses={visible}
                onChanged={onChanged}
                onTagSelect={chooseTag}
                empty={activeTab?.empty}
              />
            )}
          </>
        )}

        {!selectedTag && tab === "spending" && (
          <SpendingLog
            items={periodSpending}
            onChanged={onChanged}
            onTagSelect={chooseTag}
            hideHeading
            totalLabel={selectedPeriod ? "This pay period" : "Total this month"}
            emptyText={
              selectedPeriod
                ? "No purchases in this pay period."
                : "No purchases this month yet. Log one to see it come out of the month."
            }
          />
        )}
      </div>
    </section>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
      <path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function DashboardView({ name, expenses, paycheck, spending, onChanged }) {
  const summary = leftoverSummary({ paycheck, expenses, spending });
  const monthSpending = spending.filter((item) => isInMonth(item.spent_on));
  const firstName = String(name || "").trim().split(/\s+/)[0];

  return (
    <main className="board">
      <div className="mb-5 flex items-center justify-between gap-4 lg:mb-6">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold text-ink sm:text-3xl">
            {firstName ? `Hi, ${firstName}` : "Your money"}
          </h1>
          <p className="mt-0.5 text-sm text-muted">
            {expenses.length} {expenses.length === 1 ? "expense" : "expenses"} tracked
          </p>
        </div>
        <Link href="/addExpense" passHref>
          <a className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full bg-green px-4 font-bold text-white transition-colors hover:bg-ink sm:px-5">
            <PlusIcon />
            <span>
              Add<span className="hidden sm:inline"> expense</span>
            </span>
          </a>
        </Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(320px,380px)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <PaycheckSummary
          paycheck={paycheck}
          summary={summary}
          expenses={expenses}
          spending={spending}
        />
        <ExpenseTabs
          expenses={expenses}
          spending={spending}
          monthSpending={monthSpending}
          paycheck={paycheck}
          onChanged={onChanged}
        />
      </div>
    </main>
  );
}

export default function Container() {
  const [expenses, setExpenses] = useState(null);
  const [paycheck, setPaycheck] = useState(null);
  const [spending, setSpending] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    const [expensesResult, paycheckResult, spendingResult] = await Promise.all([
      loadExpenses(),
      supabase
        .from("paychecks")
        .select("amount, schedule, next_payday, payday_one, payday_two")
        .maybeSingle(),
      loadSpending(),
    ]);

    const queryError =
      expensesResult.error || paycheckResult.error || spendingResult.error;

    if (queryError) {
      setError(queryError.message);
      setExpenses([]);
      return;
    }

    setExpenses(expensesResult.data || []);
    setPaycheck(paycheckResult.data);
    setSpending(spendingResult.data || []);
  };

  useEffect(() => {
    let active = true;
    loadDashboard();

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !active) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();
      if (active) setName(profile?.full_name || user.user_metadata?.full_name || "");
    })();

    return () => {
      active = false;
    };
  }, []);

  if (!expenses) return <Loading />;
  if (error) {
    return (
      <main className="board">
        <p className="panel text-danger">Could not load expenses. {error}</p>
      </main>
    );
  }

  return (
    <DashboardView
      name={name}
      expenses={expenses}
      paycheck={paycheck}
      spending={spending}
      onChanged={loadDashboard}
    />
  );
}
