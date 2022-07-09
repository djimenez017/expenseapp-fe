import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function NavigationBar() {
  const router = useRouter();

  const signout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <div className="flex flex-row justify-between content-center items-center py-2 w-full bg-green1  px-2 fixed top-0 left-0 right-0">
      <h1 className="text-white text-2xl font-bold ">
        <Link href={"/"}>ExpenseApp</Link>
      </h1>
      <ol className="flex flex-row justify-end">
        <li className="px-2 text-white font-bold">
          <button>
            <Link href="/dashboard">Dashboard</Link>
          </button>
        </li>
        <li className="px-2 text-white font-bold">
          <button onClick={signout}>Log Out</button>
        </li>
      </ol>
    </div>
  );
}
