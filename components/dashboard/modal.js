import React from "react";
import ExpenseForm from "../forms/addExpense";

export default function modal() {
  return (
    <div className="z-40 bg-white h-screen w-screen	">
      <div className="z-40 bg-green w-2/4">
        <ExpenseForm />
      </div>
    </div>
  );
}
