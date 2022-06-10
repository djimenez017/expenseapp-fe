import React from "react";

export default function navigationBar() {
  const signout = () => {
    localStorage.clear();
  };

  return (
    <div className="flex flex-row justify-between content-center items-center py-3 w-full bg-green1 min-h-5 px-2">
      <h1 className="text-white text-4xl font-bold ">ExpenseApp</h1>
      <ol className="flex flex-row justify-end">
        <li className="px-5 text-white font-bold">
          <button onClick={signout}>Log Out</button>
        </li>
      </ol>
    </div>
  );
}
