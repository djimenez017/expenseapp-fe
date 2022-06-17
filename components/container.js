/* eslint-disable @next/next/link-passhref */
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import UserInfo from "./dashboard/userInfo";
import TotalCard from "./dashboard/totalCard";
import ExpenseCard from "./expenses/expenseCard";
import Button from "./button";
import Link from "next/link";

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

export default function Container(props) {
  const { loading, error, data } = useQuery(GET_USER_EXPENSES);

  if (loading) return "Getting Data...";
  if (!data) return "Waiting on Data";
  if (error) return `Submission error! ${error.message}`;

  const userData = data.expenses[0].author;
  const expensesData = data.expenses.map((expense) => {
    return (
      <ExpenseCard
        key={expense.id}
        name={expense.name}
        amount={expense.amount}
        frequency={expense.frequency}
        dateDue={expense.dateDue}
        id={expense.id}
      ></ExpenseCard>
    );
  });

  return (
    <main
      className="container box-border p-2 space-y-4"
      style={{ maxWidth: "750px" }}
    >
      <button
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        data-modal-toggle="defaultModal"
      ></button>
      <UserInfo data={userData} />
      <div className="flex flex-col">
        <Button>
          {" "}
          <Link href={`/addExpense`}>Add Expense </Link>
        </Button>
      </div>
      <div className="w-300px space-y-10">{expensesData}</div>
    </main>
  );
}
