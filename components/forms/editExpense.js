import React, { useState } from "react";
import Button from "../button";
import { gql, useMutation, useQuery } from "@apollo/client";
import formatMoney from "../lib/formatMoney";

const SINGLE_EXPENSE = gql`
  query Expense {
    expense(id: 8) {
      name
      frequency
      id
      dateDue
      amount
    }
  }
`;

export default function EditExpense() {
  const { data, loading, error } = useQuery(SINGLE_EXPENSE);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState();
  const [date, setDate] = useState("");
  const [frequency, setFrequency] = useState("");

  if (loading) return <p>Expense Added!!</p>;
  if (error) return `Submission error! ${error}`;

  const nameHandler = () => {
    setName(data.expense.name);
  };

  return (
    <>
      <form autoComplete="off">
        <div className="my-5">
          <label htmlFor="ExpenseName">Expense Name</label>
          <input
            id="ExpenseName"
            contentEditable="true"
            className={"p-2 w-full"}
            required
            value={data.expense.name}

            // onChange={nameHandler}
          />
          <label htmlFor="Amount">Amount</label>
          <input
            id="Amount"
            className={"p-2 w-full"}
            required
            // onChange={amountHandler}
            type="number"
            value={formatMoney(data.expense.amount)}
          />
          <label htmlFor="Frequency">Frequency</label>
          <input
            name="Frequency"
            className={"p-2 w-full"}
            required
            value={data.expense.frequency}
            // onChange={frequencyHandler}
          />
          <label htmlFor="Date">Due Date</label>
          <input
            id="Date"
            className={"p-2 w-full"}
            required
            value={new Date(data.expense.dateDue).toDateString()}
            // onChange={dateHandler}
            type="date"
          />
          <br />
          <Button type="Submit">Add Expense</Button>
        </div>
      </form>
    </>
  );
}
