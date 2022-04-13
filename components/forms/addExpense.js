import React, { useState } from "react";
import Button from "../button";

export default function AddExpense() {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [expenseFrequency, setExpenseFrequency] = useState("");

  const nameHandler = (e) => {
    setExpenseName(e.target.value);
  };

  const amountHandler = (e) => {
    setExpenseAmount(e.target.value);
  };

  const dateHandler = (e) => {
    setExpenseDate(e.target.value);
  };

  const frequencyHandler = (e) => {
    setExpenseFrequency(e.target.value);
  };

  console.log(expenseAmount, expenseAmount, expenseFrequency, expenseName);

  return (
    <>
      <div>Add New Expense</div>{" "}
      <form>
        <div className="my-5">
          <label htmlFor="ExpenseName">Expense Name</label>
          <input
            id="ExpenseName"
            className={"p-2 w-full"}
            required
            onChange={nameHandler}
          />
          <label htmlFor="Amount">Amount</label>
          <input
            id="Amount"
            className={"p-2 w-full"}
            required
            onChange={amountHandler}
            type="number"
          />
          <label htmlFor="Frequency">Frequency</label>
          <input
            name="Frequency"
            className={"p-2 w-full"}
            required
            onChange={frequencyHandler}
          />
          <label htmlFor="Date">Due Date</label>
          <input
            id="Date"
            className={"p-2 w-full"}
            required
            onChange={dateHandler}
            type="date"
          />
          <br />
          <Button type="Submit">Register</Button>
        </div>
      </form>
    </>
  );
}
