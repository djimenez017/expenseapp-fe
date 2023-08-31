import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function NavigationBar(props) {
  const router = useRouter();

  const signout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <div className="flex flex-row md:justify-around justify-between content-center items-center py-3 px-3 w-full bg-white shadow-md">
      <h1 className="text-green text-2xl font-bold transition duration-300 ease-in-out hover:text-orange ">
        <Link href={"/dashboard"}>ExpenseApp</Link>
      </h1>
      <ol className="flex flex-row justify-end">
        <li className="px-2 text-green font-bold transition duration-300 ease-in-out hover:text-orange">
          <button onClick={signout}>Log Out</button>
        </li>
      </ol>
    </div>
  );
}
