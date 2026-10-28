import React, { useState } from "react";
import { useRouter } from "next/router";
import Input from "../forms/formComponents/input";
import Select from "../forms/formComponents/Select";
import Submit from "../forms/formComponents/Submit";
import Loading from "../UI/Loading";
import { supabase } from "../lib/supabase";

export default function AddExpense() {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [expenseFrequency, setExpenseFrequency] = useState("DAILY");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const expenseSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      router.push("/");
      return;
    }

    const { error: insertError } = await supabase.from("expenses").insert({
      user_id: user.id,
      name: expenseName,
      amount: parseFloat(expenseAmount),
      frequency: expenseFrequency,
      date_due: new Date(`${expenseDate}T00:00:00`).toISOString(),
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push("/dashboard");
  };

  if (loading) return <Loading />;

  return (
    <>
      {error && <p className="text-red-700 bg-red-200">{error}</p>}
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
