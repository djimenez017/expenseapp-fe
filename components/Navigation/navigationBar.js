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
    <div className="flex flex-row justify-between content-center items-center py-3 w-full bg-green1 min-h-5 px-2">
      <h1 className="text-white text-4xl font-bold ">
        <Link href={"/"}>ExpenseApp</Link>
      </h1>
      <ol className="flex flex-row justify-end">
        <li className="px-5 text-white font-bold">
          <button onClick={signout}>Log Out</button>
        </li>
      </ol>
    </div>
  );
}
