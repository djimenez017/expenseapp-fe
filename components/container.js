import React, { useEffect, useState } from "react";
import ExpenseCard from "./expenses/expenseCard";
import Button from "./button";
import Loading from "./UI/Loading";
import UserInfo from "./dashboard/userInfo";
import { supabase } from "./lib/supabase";

export default function Container() {
  const [expenses, setExpenses] = useState(null);
  const [error, setError] = useState("");

  const loadExpenses = async () => {
    const { data, error: queryError } = await supabase
      .from("expenses")
      .select("id, name, amount, frequency, date_due")
      .order("date_due", { ascending: true });

    if (queryError) {
      setError(queryError.message);
      setExpenses([]);
      return;
    }

    setExpenses(data || []);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  if (!expenses) return <Loading />;
  if (error) return `Could not load expenses. ${error}`;

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
