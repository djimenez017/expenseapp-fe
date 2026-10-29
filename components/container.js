import React, { useEffect, useState } from "react";
import ExpenseCard from "./expenses/expenseCard";
import Button from "./button";
import Loading from "./UI/Loading";
import UserInfo from "./dashboard/userInfo";
import { getCurrentUser } from "./lib/currentUser";
import { messages } from "./lib/limits";
import { supabase } from "./lib/supabase";

export default function Container() {
  const [expenses, setExpenses] = useState(null);
  const [error, setError] = useState("");

  const loadExpenses = async () => {
    const user = await getCurrentUser();
    if (!user) {
      setError(messages.loadExpensesFailed);
      setExpenses([]);
      return;
    }

    const { data, error: queryError } = await supabase
      .from("expenses")
      .select("id, name, amount, frequency, date_due")
      .eq("user_id", user.id)
      .order("date_due", { ascending: true });

    if (queryError) {
      setError(messages.loadExpensesFailed);
      setExpenses([]);
      return;
    }

    setError("");
    setExpenses(data || []);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  if (!expenses) return <Loading />;
  if (error) return messages.loadExpensesFailed;

  return (
    <main
      className="container box-border p-2 space-y-4 mb-10"
      style={{ maxWidth: "750px" }}
    >
      <UserInfo />
      <div className="flex flex-col">
        <Button to="addExpense">Add Expense</Button>
        <br />
        <Button to="/details">More Details</Button>
      </div>
      <div className="w-300px space-y-10">
        {expenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            name={expense.name}
            amount={expense.amount}
            frequency={expense.frequency}
            dateDue={expense.date_due}
            id={expense.id}
            onDeleted={loadExpenses}
          />
        ))}
      </div>
    </main>
  );
}
