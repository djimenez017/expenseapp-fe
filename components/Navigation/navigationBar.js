import React from "react";

export default function navigationBar() {
  return (
    <div className="flex flex-row justify-between content-center items-center py-5 w-full bg-green1 min-h-5 px-5">
      <h1 className="text-white text-4xl font-bold ">Expense App</h1>
      <ol className="flex flex-row justify-end">
        <li className="px-5 text-white font-bold">Log Out</li>
        <li className="px-5 text-white font-bold">My Account</li>
      </ol>
    </div>
  );
}
