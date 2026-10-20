import React, { useState } from "react";
import formatDate from "../lib/formatDate";
import Link from "next/link";
import formatDateExtension from "../lib/formatDateExtension";
import Loading from "../UI/Loading";
import { deleteExpense } from "../lib/expenses";

export default function ExpenseCard(props) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const initials = props.name
    .split(" ")
    .map((word) => word[0])
    .join("");

  const nextPayment = formatDate(props.frequency, props.dateDue);

  const deleteHandler = async (e) => {
    e.preventDefault();
    setDeleting(true);
    setError("");
    try {
      await deleteExpense(props.id);
      if (props.onDeleted) await props.onDeleted();
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  if (deleting) return <Loading />;

  return (
    <div
      className="flex bg-white shadow-lg  md:flex-row flex-col"
      style={{ maxWidth: "750px" }}
    >
      <div className=" md:w-2/12 md:text-center md:flex items-center content-center justify-items-center bg-green rounded-l-lg hidden">
        <div className="w-full h-max ">
          <h3 className="text-3xl font-bold text-white">{initials}</h3>
        </div>
      </div>

      <div className="p-6 md:w-9/12 ">
        <div className="flex justify-between md:flex-row flex-col text-left ">
          <h3 className="text-3xl font-bold">{props.name}</h3>
          <p className="text-l font-bold">
            <span className="text-orange text-md">
              ${Number(props.amount).toFixed(2)}{" "}
            </span>
            {props.frequency}
          </p>
        </div>
        <p>
          Due{" "}
          <span className="text-orange text-md">
            {props.frequency.toLowerCase()}
          </span>{" "}
          every{" "}
          <span className="text-orange text-md">
            {formatDateExtension(nextPayment.getDate())}
          </span>
        </p>
        {error && <p className="text-red-700">{error}</p>}
      </div>

      <div className="md:w-1/12 w-full md:flex-row self-center flex-row h-full">
        <Link
          href={`/edit/${props.id}`}
          className="inline-block text-center bg-green text-white md:w-full h-full py-2 md:py-4 w-1/2 md:rounded-tr-lg"
        >
          Edit
        </Link>
        <button
          className=" bg-orange md:w-full h-full py-2 md:py-4 text-white w-1/2 rounded-br-lg md:rounded-br-lg"
          onClick={deleteHandler}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
