import React from "react";
import formatMoney from "../lib/formatMoney";
import Modal from "../dashboard/modal";

export default function expenseCard(props) {
  const date = props.dateDue;

  const initials = props.name
    .split(" ")
    .map((word) => word[0])
    .join("");

  const editHandler = () => {
    console.log(props.id);
    <Modal />;
  };

  const deleteHandler = () => {
    console.log(props.id);
  };

  return (
    <div
      className="flex  bg-white shadow-lg md:flex-row flex-col"
      style={{ maxWidth: "750px" }}
    >
      <div className=" md:w-2/12 md:text-center md:flex items-center content-center justify-items-center bg-green1 rounded-l-lg hidden">
        <div className="w-full h-max ">
          <h3 className="text-3xl font-bold ">{initials}</h3>
        </div>
      </div>

      <div className="p-6 md:w-9/12 ">
        <div className="flex justify-between md:flex-row flex-col text-left ">
          <h3 className="text-3xl font-bold">{props.name}</h3>
          <p className="text-l font-bold">
            {formatMoney(props.amount)}/{props.frequency}
          </p>
        </div>
        <p>Due Date: {new Date(date).toDateString()}</p>
      </div>

      <div className="md:w-1/12 w-full md:flex-row self-center flex-row h-full">
        <button
          className=" bg-yellow md:w-full h-full py-2 md:py-4 w-1/2  md:rounded-tr-lg"
          onClick={editHandler}
        >
          Edit
        </button>
        <button
          className=" bg-red md:w-full h-full py-2 md:py-4 text-white w-1/2 rounded-br-lg md:rounded-br-lg"
          onClick={deleteHandler}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// flex flex-column basis-1/12 bg-green1 rounded-none sm:rounded-full w-1/3 content-center items-center h-full
