import React from "react";
import Navigation from "../components/Navigation/navigationBar";
import PaycheckForm from "../components/forms/paycheckForm";
import Session from "../components/hoc/session";
import Title from "../components/UI/Title";
import Footer from "../components/Navigation/footer";

export default function Paycheck() {
  return (
    <Session>
      <Navigation />
      <main className="shell space-y-6">
        <Title>Paycheck</Title>
        <PaycheckForm />
      </main>
      <Footer />
    </Session>
  );
}
