import React from "react";
import UserInfo from "./dashboard/userInfo";
import TotalCard from "./dashboard/totalCard";
import ExpenseCard from "./expenses/expenseCard";
import Button from "./button";

export default function container(props) {
  return (
    <main
      className="container box-border p-2 space-y-4"
      style={{ maxWidth: "650px" }}
    >
      <UserInfo />
      <div className="flex flex-col space-y-3 md:flex md:flex-row md:space-x-3 md:space-y-0 w-30">
        <TotalCard />
        <TotalCard />
      </div>
      <div className=" w-300px space-y-10">
        <ExpenseCard />
        <ExpenseCard />
        <ExpenseCard />
      </div>
      <Button>Add Expense</Button>
    </main>
  );
}

// flex s:bg-grey flex-column justify-center justify-items-center p-2 content-center space-x-4
// space-y-4 p-2 bg-white
