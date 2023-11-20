import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Input from "../forms/formComponents/input";
import Select from "../forms/formComponents/Select";
import Submit from "../forms/formComponents/Submit";
import Loading from "../UI/Loading";

const ADD_EXPENSE_MUTATION = gql`
  mutation createExpense(
    $name: String
    $amount: Float
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

const GET_USER_EXPENSES = gql`
  query expenses {
    expenses {
      id
      author {
        fullName
        id
        username
        emailAddress
      }
      name
      amount
      frequency
      dateDue
      expenseAuthor
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
    const stringToInt = parseFloat(e.target.value);
    setExpenseAmount(stringToInt);
  };

  const dateHandler = (e) => {
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

  const [addExpense, { data, loading, error }] = useMutation(
    ADD_EXPENSE_MUTATION,
    { refetchQueries: [{ query: GET_USER_EXPENSES }] }
  );

  if (loading) return <Loading
  if (data) router.push("/dashboard");
  if (error) return `Submission error! ${error.message}`;

  return (
    <>
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
            onChange={nameHandler}
            name="name"
          >
            Expense Name
          </Input>
          <Input
            htmlFor="amount"
            id="amount"
            required
            onChange={amountHandler}
            type="number"
            name="amount"
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
            onChange={frequencyHandler}
          >
            Frequency
          </Select>
          <Input
            htmlFor="date"
            id="date"
            required
            onChange={dateHandler}
            type="date"
            name="date"
          >
            Due date
          </Input>

          <Submit />
        </div>
      </form>
    </>
  );
}
