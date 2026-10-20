import React, { useState } from "react";
import { useRouter } from "next/router";
import Input from "../forms/formComponents/input";
import Select from "../forms/formComponents/Select";
import Submit from "../forms/formComponents/Submit";
import Loading from "../UI/Loading";
import { createExpense } from "../lib/expenses";

export default function AddExpense() {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [expenseFrequency, setExpenseFrequency] = useState("MONTHLY");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const expenseSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createExpense({
        name: expenseName,
        amount: expenseAmount,
        frequency: expenseFrequency,
        dateDue: expenseDate,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      {error && (
        <div className="text-red-700 bg-red-200 p-2 mb-2">
          <p>{error}</p>
        </div>
      )}
      <form
        onSubmit={expenseSubmitHandler}
        autoComplete="off"
        className="my-5 "
      >
        <div>
          <Input
            htmlFor="ExpenseName"
            id="ExpenseName"
            required
            onChange={(e) => setExpenseName(e.target.value)}
            name="name"
            value={expenseName}
          >
            Expense Name
          </Input>
          <Input
            htmlFor="amount"
            id="amount"
            required
            onChange={(e) => setExpenseAmount(e.target.value)}
            type="number"
            name="amount"
            value={expenseAmount}
            placeholder="0.00"
            step="0.01"
            pattern="\d+(\.\d{1,2})?"
          >
            Amount
          </Input>

          <Select
            htmlFor="frequency"
            name="frequency"
            id="frequency"
            value={expenseFrequency}
            onChange={(e) => setExpenseFrequency(e.target.value)}
          >
            Frequency
          </Select>
          <Input
            htmlFor="date"
            id="date"
            required
            onChange={(e) => setExpenseDate(e.target.value)}
            type="date"
            name="date"
            value={expenseDate}
          >
            Due date
          </Input>

          <Submit />
        </div>
      </form>
    </>
  );
}
