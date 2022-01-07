import React from "react";
import UserInfo from "./dashboard/userInfo";
import TotalCard from "./dashboard/totalCard";
import ExpenseCard from "./expenses/expenseCard";

export default function container(props) {
  return (
    <main className="container mx-auto bg-[grey] p-10 space-y-4 ">
      <UserInfo />
      <div className="flex flex-row justify-center justify-items-center content-center space-x-4">
        <TotalCard />
        <TotalCard />
      </div>
      <div className="space-y-4 ">
        <ExpenseCard />
        <ExpenseCard />
        <ExpenseCard />
      </div>
    </main>
  );
}
