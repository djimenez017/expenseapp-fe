import React from "react";
import Navigation from "../components/Navigation/navigationBar";
import AddExpenseForm from "../components/forms/addExpense";
import Session from "../components/hoc/session";

export default function addExpense() {
  return (
    <Session>
      <Navigation />{" "}
      <div className="flex h-screen justify-center items-center">
        <main
          className="container box-border p-2 space-y-4 "
          style={{ maxWidth: "750px" }}
        >
          <h2 className="text-4xl font-bold tracking-wide text-center">
            Create an Expense
          </h2>
          <AddExpenseForm />
        </main>
      </div>
    </Session>
  );
}
