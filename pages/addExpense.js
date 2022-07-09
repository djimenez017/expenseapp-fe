import React from "react";
import Navigation from "../components/Navigation/navigationBar";
import AddExpenseForm from "../components/forms/addExpense";
import Session from "../components/hoc/session";
import Title from "../components/UI/Title";
import Footer from "../components/Navigation/footer";

export default function addExpense() {
  return (
    <Session>
      <Navigation />{" "}
      <div className="flex h-screen justify-center items-center">
        <main
          className="container box-border p-2 space-y-4 "
          style={{ maxWidth: "750px" }}
        >
          <Title>Create an Expense</Title>
          <AddExpenseForm />
        </main>
      </div>
      <Footer />
    </Session>
  );
}
