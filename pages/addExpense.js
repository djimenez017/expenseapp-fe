import React from "react";
import Navigation from "../components/Navigation/navigationBar";
import AddExpenseForm from "../components/forms/addExpense";

export default function addExpense() {
  return (
    <div className="w-full	">
      <Navigation />
      <main
        className="container box-border p-2 space-y-4"
        style={{ maxWidth: "750px" }}
      >
        <h2>Create an Expense</h2>
        <AddExpenseForm />
      </main>
    </div>
  );
}
