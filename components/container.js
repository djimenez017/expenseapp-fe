import React, { useEffect, useState } from "react";
import ExpenseCard from "./expenses/expenseCard";
import Button from "./button";
import Loading from "./UI/Loading";
import UserInfo from "./dashboard/userInfo";
import PaycheckSummary from "./dashboard/paycheckSummary";
import SpendingLog from "./dashboard/spendingLog";
import { supabase } from "./lib/supabase";
import { formatDollars, isInMonth, leftoverSummary } from "./lib/leftover";
import {
  EXPENSE_FREQUENCIES,
  RECOMMENDED_UTILIZATION,
  aboveRecommendedUse,
  combinedUtilization,
  filterByFrequency,
  formatUtilization,
} from "./lib/expenseOptions";
import { collectTags, hasTag, loadExpenses, loadSpending } from "./lib/tags";

function ExpenseList({ expenses, onChanged, onTagSelect, showKind }) {
  if (expenses.length === 0) return <p className="text-muted">None yet.</p>;

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          name={expense.name}
          amount={expense.amount}
          frequency={expense.frequency}
          dateDue={expense.date_due}
          kind={expense.kind}
          remainingBalance={expense.remaining_balance}
          creditLimit={expense.credit_limit}
          tags={expense.tags}
          id={expense.id}
          showKind={showKind}
          onTagSelect={onTagSelect}
          onDeleted={onChanged}
        />
      ))}
    </div>
  );
}

function TagFilter({ tags, selectedId, onSelect }) {
  if (tags.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto py-3">
      {tags.map((tag) => {
        const selected = tag.id === selectedId;
        return (
          <button
            key={tag.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(tag)}
            className={`whitespace-nowrap rounded-full border px-3 py-1 text-sm font-bold ${
              selected
                ? "border-ink bg-ink text-paper"
                : "border-line bg-white text-muted hover:text-ink"
            }`}
          >
            {tag.name}
          </button>
        );
      })}
    </div>
  );
}

function scheduleInList(expenses, frequency) {
  if (!frequency) return "";
  return expenses.some((expense) => expense.frequency === frequency) ? frequency : "";
}

function FrequencyList({ expenses, frequency, onFrequency, onChanged, onTagSelect, showKind }) {
  const active = scheduleInList(expenses, frequency);
  const visible = filterByFrequency(expenses, active);
  const label = EXPENSE_FREQUENCIES.find((item) => item.value === active)?.label.toLowerCase();

  return (
    <div className="space-y-4">
      <FrequencyFilter expenses={expenses} value={active} onChange={onFrequency} />
      {expenses.length > 0 && visible.length === 0 ? (
        <p className="text-muted">No {label} expenses.</p>
      ) : (
        <ExpenseList
          expenses={visible}
          onChanged={onChanged}
          onTagSelect={onTagSelect}
          showKind={showKind}
        />
      )}
    </div>
  );
}

function FrequencyFilter({ expenses, value, onChange }) {
  if (expenses.length === 0) return null;

  const present = EXPENSE_FREQUENCIES.map((item) => ({
    value: item.value,
    label: item.label,
    count: expenses.filter((expense) => expense.frequency === item.value).length,
  })).filter((item) => item.count > 0);

  if (present.length < 2) return null;

  const options = [{ value: "", label: "All", count: expenses.length }, ...present];

  return (
    <div className="flex gap-2 overflow-x-auto">
      {options.map((item) => {
        const selected = (value || "") === item.value;
        return (
          <button
            key={item.value || "all"}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(item.value)}
            className={`whitespace-nowrap rounded-full border px-3 py-1 text-sm font-bold ${
              selected
                ? "border-ink bg-ink text-paper"
                : "border-line bg-white text-muted hover:text-ink"
            }`}
          >
            {item.label}
            <span className="ml-2">{item.count}</span>
          </button>
        );
      })}
    </div>
  );
}

function CreditUtilization({ cards }) {
  const summary = combinedUtilization(cards);
  if (!summary) {
    if (cards.length === 0) return null;
    return <p className="text-sm text-muted">Add a credit limit to see utilization.</p>;
  }

  const high = aboveRecommendedUse(summary.rate);
  const width = Math.min(100, summary.rate * 100);
  const target = Math.round(RECOMMENDED_UTILIZATION * 100);

  return (
    <div className={`rounded-2xl border px-4 py-4 ${high ? "border-danger bg-white" : "border-line bg-white"}`}>
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-bold uppercase tracking-widest text-muted">Utilization</p>
        <p className={`text-3xl ${high ? "text-danger" : "text-green"}`}>
          {formatUtilization(summary.rate)}
        </p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-paper">
        <div
          className={`h-full rounded-full ${high ? "bg-danger" : "bg-green"}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <p className={`mt-2 text-sm font-bold ${high ? "text-danger" : "text-green"}`}>
        {high ? `Above ${target}%` : `Within ${target}%`}
        <span className="ml-2 font-normal text-muted">
          {formatDollars(summary.balance)} of {formatDollars(summary.limit)}
        </span>
      </p>
    </div>
  );
}

function ExpenseTabs({ expenses, monthSpending, spending, onChanged }) {
  const [tab, setTab] = useState("subscriptions");
  const [tagId, setTagId] = useState(null);
  const [frequency, setFrequency] = useState("");
  const subscriptions = expenses.filter((expense) => expense.kind === "SUBSCRIPTION");
  const bills = expenses.filter((expense) => !expense.kind || expense.kind === "BILL");
  const loans = expenses.filter((expense) => expense.kind === "LOAN");
  const creditCards = expenses.filter((expense) => expense.kind === "CREDIT_CARD");
  const tags = collectTags([expenses, spending]);
  const selectedTag = tags.find((tag) => tag.id === tagId) || null;
  const tabs = [
    { id: "subscriptions", label: "Subscriptions", count: subscriptions.length },
    { id: "bills", label: "Bills", count: bills.length },
    { id: "loans", label: "Loans", count: loans.length },
    { id: "creditCards", label: "Credit cards", count: creditCards.length },
    { id: "spending", label: "Spending", count: monthSpending.length },
  ];

  const chooseTab = (id) => {
    setTagId(null);
    setTab(id);
  };

  const chooseTag = (tag) => {
    setTagId((current) => (current === tag.id ? null : tag.id));
  };

  const taggedExpenses = selectedTag ? expenses.filter((expense) => hasTag(expense, selectedTag.id)) : [];
  const taggedSpending = selectedTag ? spending.filter((item) => hasTag(item, selectedTag.id)) : [];
  const activeFrequency = scheduleInList(taggedExpenses, frequency);
  const visibleTaggedExpenses = filterByFrequency(taggedExpenses, activeFrequency);
  const frequencyLabel =
    EXPENSE_FREQUENCIES.find((item) => item.value === activeFrequency)?.label.toLowerCase() || "";

  return (
    <section>
      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-line">
        {tabs.map((item) => {
          const selected = !selectedTag && tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => chooseTab(item.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-bold ${
                selected ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {item.label}
              <span className="ml-2">{item.count}</span>
            </button>
          );
        })}
      </div>
      <TagFilter tags={tags} selectedId={selectedTag?.id} onSelect={chooseTag} />
      <div role="tabpanel" className="pt-5">
        {selectedTag && (
          <div className="space-y-6">
            <p className="text-sm font-bold uppercase tracking-widest text-muted">
              {selectedTag.name}
            </p>
            <FrequencyFilter
              expenses={taggedExpenses}
              value={activeFrequency}
              onChange={setFrequency}
            />
            {taggedExpenses.length === 0 && taggedSpending.length === 0 && (
              <p className="text-muted">Nothing tagged {selectedTag.name}.</p>
            )}
            {taggedExpenses.length > 0 && visibleTaggedExpenses.length === 0 && (
              <p className="text-muted">No {frequencyLabel} expenses with this tag.</p>
            )}
            {visibleTaggedExpenses.length > 0 && (
              <ExpenseList
                expenses={visibleTaggedExpenses}
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
          </div>
        )}
        {!selectedTag && tab === "subscriptions" && (
          <FrequencyList
            expenses={subscriptions}
            frequency={frequency}
            onFrequency={setFrequency}
            onChanged={onChanged}
            onTagSelect={chooseTag}
          />
        )}
        {!selectedTag && tab === "bills" && (
          <FrequencyList
            expenses={bills}
            frequency={frequency}
            onFrequency={setFrequency}
            onChanged={onChanged}
            onTagSelect={chooseTag}
          />
        )}
        {!selectedTag && tab === "loans" && (
          <FrequencyList
            expenses={loans}
            frequency={frequency}
            onFrequency={setFrequency}
            onChanged={onChanged}
            onTagSelect={chooseTag}
          />
        )}
        {!selectedTag && tab === "creditCards" && (
          <div className="space-y-4">
            <CreditUtilization cards={creditCards} />
            <FrequencyList
              expenses={creditCards}
              frequency={frequency}
              onFrequency={setFrequency}
              onChanged={onChanged}
              onTagSelect={chooseTag}
            />
          </div>
        )}
        {!selectedTag && tab === "spending" && (
          <SpendingLog
            items={monthSpending}
            onChanged={onChanged}
            onTagSelect={chooseTag}
            hideHeading
          />
        )}
      </div>
    </section>
  );
}

export default function Container() {
  const [expenses, setExpenses] = useState(null);
  const [paycheck, setPaycheck] = useState(null);
  const [spending, setSpending] = useState([]);
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
    loadDashboard();
  }, []);

  if (!expenses) return <Loading />;
  if (error) {
    return (
      <main className="board">
        <p className="panel text-danger">Could not load expenses. {error}</p>
      </main>
    );
  }

  const summary = leftoverSummary({ paycheck, expenses, spending });
  const monthSpending = spending.filter((item) => isInMonth(item.spent_on));

  return (
    <main className="board space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <UserInfo />
        <div className="grid w-full grid-cols-2 gap-3 sm:w-72">
          <Button to="/addExpense">Add expense</Button>
          <Button to="/details" variant="quiet">Details</Button>
        </div>
      </div>
      <PaycheckSummary paycheck={paycheck} summary={summary} expenses={expenses} />
      <ExpenseTabs
        expenses={expenses}
        spending={spending}
        monthSpending={monthSpending}
        onChanged={loadDashboard}
      />
    </main>
  );
}
