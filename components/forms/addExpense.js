import React, { useState } from "react";
import Button from "../button";
import { gql, useMutation } from "@apollo/client";

const ADD_EXPENSE_MUTATION = gql`
  mutation createExpense(
    $name: String
    $amount: Int
    $frequency: Frequency
    $dateDue: DateTime
  ) {
    createExpense(
      name: $name
      amount: $amount
      frequency: $frequency
      dateDue: $dateDue
    ) {
      name
    }
  }
`;

export default function AddExpense() {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState();
  const [expenseDate, setExpenseDate] = useState("");
  const [expenseFrequency, setExpenseFrequency] = useState("");

  const nameHandler = (e) => {
    setExpenseName(e.target.value);
  };

  const amountHandler = (e) => {
    const stringToInt = parseInt(e.target.value);
    console.log(stringToInt);
    setExpenseAmount(stringToInt);
  };

  const dateHandler = (e) => {
    console.log(e.target.value);
    const date = e.target.value;
    const dateEntered = new Date(date);
    setExpenseDate(dateEntered.toISOString());
  };

  const frequencyHandler = (e) => {
    setExpenseFrequency(e.target.value);
  };

  const expenseSubmitHandler = (e) => {
    e.preventDefault();
    addExpense({
      variables: {
        name: expenseName,
        amount: expenseAmount,
        frequency: expenseFrequency,
        dateDue: expenseDate,
      },
    });
    setExpenseName("");
    setExpenseAmount("");
    setExpenseDate("");
    setExpenseFrequency("");
  };

  // console.log(expenseAmount, expenseDate, expenseFrequency, expenseName);

  const [addExpense, { data, loading, error }] =
    useMutation(ADD_EXPENSE_MUTATION);

  if (loading) return <p>Expense Added!!</p>;
  if (error) return `Submission error! ${error.message}`;

  return (
    <>
      <div>Add New Expense</div>{" "}
      <form onSubmit={expenseSubmitHandler} autoComplete="off">
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
          <Button type="Submit">Add Expense</Button>
        </div>
      </form>
    </>
  );
}
