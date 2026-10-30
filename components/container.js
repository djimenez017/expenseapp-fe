import React, { useEffect, useState } from "react";
import ExpenseCard from "./expenses/expenseCard";
import Button from "./button";
import Loading from "./UI/Loading";
import UserInfo from "./dashboard/userInfo";
import PaycheckSummary from "./dashboard/paycheckSummary";
import SpendingLog from "./dashboard/spendingLog";
import { supabase } from "./lib/supabase";
import { isInMonth, leftoverSummary } from "./lib/leftover";

function ExpenseSection({ title, expenses, onChanged }) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl">{title}</h2>
        <span className="text-sm text-muted">{expenses.length}</span>
      </div>
      {expenses.length === 0 ? (
        <p className="text-muted">None yet.</p>
      ) : (
        expenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            name={expense.name}
            amount={expense.amount}
            frequency={expense.frequency}
            dateDue={expense.date_due}
            kind={expense.kind}
            remainingBalance={expense.remaining_balance}
            id={expense.id}
            onDeleted={onChanged}
          />
        ))
      )}
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
      supabase
        .from("expenses")
        .select("id, name, amount, frequency, date_due, kind, remaining_balance")
        .order("date_due", { ascending: true }),
      supabase.from("paychecks").select("amount, schedule, next_payday").maybeSingle(),
      supabase
        .from("spending")
        .select("id, name, amount, spent_on")
        .order("spent_on", { ascending: false }),
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
      <main className="shell">
        <p className="panel text-danger">Could not load expenses. {error}</p>
      </main>
    );
  }

  const summary = leftoverSummary({ paycheck, expenses, spending });
  const monthSpending = spending.filter((item) => isInMonth(item.spent_on));

  return (
    <main className="shell space-y-8">
      <UserInfo />
      <div className="grid grid-cols-2 gap-3">
        <Button to="/addExpense">Add expense</Button>
        <Button to="/details" variant="quiet">Details</Button>
      </div>
      <PaycheckSummary paycheck={paycheck} summary={summary} expenses={expenses} />
      <div className="space-y-10">
        <ExpenseSection
          title="Subscriptions"
          expenses={expenses.filter((expense) => expense.kind === "SUBSCRIPTION")}
          onChanged={loadDashboard}
        />
        <ExpenseSection
          title="Loans"
          expenses={expenses.filter((expense) => expense.kind === "LOAN")}
          onChanged={loadDashboard}
        />
        <ExpenseSection
          title="Bills"
          expenses={expenses.filter(
            (expense) => !expense.kind || expense.kind === "BILL"
          )}
          onChanged={loadDashboard}
        />
        <SpendingLog items={monthSpending} onChanged={loadDashboard} />
      </div>
    </main>
  );
}
