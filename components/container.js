import { useEffect, useState } from "react";
import UserInfo from "./dashboard/userInfo";
import ExpenseCard from "./expenses/expenseCard";
import Button from "./button";
import Loading from "./UI/Loading";
import { fetchExpenses } from "./lib/expenses";

export default function Container() {
  const [expenses, setExpenses] = useState(null);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    fetchExpenses()
      .then((rows) => {
        if (!active) return;
        setExpenses(rows);
        setError("");
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  if (error) return <p className="text-red-700 bg-red-200 p-2">{error}</p>;
  if (!expenses) return <Loading />;

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
      {expenses.length === 0 ? (
        <p>You have no expenses yet.</p>
      ) : (
        <div className="w-300px space-y-10">
          {expenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              name={expense.name}
              amount={expense.amount}
              frequency={expense.frequency}
              dateDue={expense.dateDue}
              id={expense.id}
              onDeleted={() => setReloadKey((key) => key + 1)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
