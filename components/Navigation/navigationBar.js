import React from "react";

export default function navigationBar() {
  return (
    <div className="flex flex-row justify-around content-center py-5 w-full bg-[green] min-h-5">
      <h1>Expense App</h1>
      <ol className="flex flex-row justify-end">
        <li className="px-5">Log Out</li>
        <li className="px-5">My Account</li>
        <li className="px-5">Dashboard</li>
      </ol>
    </div>
  );
}
