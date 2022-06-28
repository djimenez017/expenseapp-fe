import React, { useState } from "react";
import Button from "../button";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

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
  const router = useRouter();

  const nameHandler = (e) => {
    setExpenseName(e.target.value);
  };

  const amountHandler = (e) => {
    const stringToInt = parseInt(e.target.value);
    setExpenseAmount(stringToInt);
  };

  const dateHandler = (e) => {
    //console.log(e.target.value);
    const date = e.target.value;
    const dateEntered = new Date(date);
    setExpenseDate(dateEntered.toISOString());
  };

  const frequencyHandler = (e) => {
    setExpenseFrequency(e.target.value);
    console.log(e.target.value);
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

  const [addExpense, { data, loading, error }] =
    useMutation(ADD_EXPENSE_MUTATION);

  if (loading) return <p>Expense Added!!</p>;
  if (data) router.push("/dashboard");
  if (error) return `Submission error! ${error.message}`;

  return (
    <>
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

          <select
            name="frequency"
            id="frequency"
            className={"p-2 w-full"}
            onChange={frequencyHandler}
          >
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>
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
