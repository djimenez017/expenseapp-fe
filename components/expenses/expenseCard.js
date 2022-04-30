import React from "react";
import formatMoney from "../lib/formatMoney";

export default function expenseCard(props) {
  const date = props.dateDue;

  const initials = props.name
    .split(" ")
    .map((word) => word[0])
    .join("");

  const editHandler = () => {
    console.log(props.id);
  };

  const deleteHandler = () => {
    console.log(props.id);
  };

  return (
    <div
      className="flex space-x-2 bg-white rounded-md shadow-lg"
      style={{ maxWidth: "750px" }}
    >
      <div className="p-6 w-2/12 text-center flex debug items-center content-center justify-items-center bg-green1 rounded-l-lg">
        <div className="w-full h-max">
          <h3 className="text-3xl font-bold">{initials}</h3>
        </div>
      </div>

      <div className="p-6 w-9/12 ">
        <div className="flex justify-between content-center items-center">
          {" "}
          <h3 className="text-3xl font-bold">{props.name}</h3>
          <p className="text-l font-bold">
            {formatMoney(props.amount)}/{props.frequency}
          </p>
        </div>

        <p>Due Date: {new Date(date).toDateString()}</p>
      </div>
      <div className="w1/12 flex-col self-center">
        <button
          className="rounded-tr-lg  bg-yellow  w-full h-full py-4"
          onClick={editHandler}
        >
          Edit
        </button>
        <button
          className="rounded-br-lg  bg-red w-full h-full py-4 text-white"
          onClick={deleteHandler}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// flex flex-column basis-1/12 bg-green1 rounded-none sm:rounded-full w-1/3 content-center items-center h-full
