import React from "react";
import Navigation from "../components/Navigation/navigationBar";
import AddExpenseForm from "../components/forms/addExpense";
import Session from "../components/hoc/session";
import Title from "../components/UI/Title";
import Footer from "../components/Navigation/footer";

export default function addExpense() {
  return (
    <Session>
      <Navigation />
      <main className="shell space-y-6">
        <Title>New expense</Title>
        <AddExpenseForm />
      </main>
      <Footer />
    </Session>
  );
}
