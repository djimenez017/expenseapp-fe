import React from "react";

export default function expenseCard(props) {
  const date = props.dateDue;

  return (
    <div
      className="flex p-2 space-x-2 bg-white rounded-md"
      style={{ maxWidth: "650px" }}
    >
      <div className="w-2/12 text-center flex items-center content-center justify-items-center bg-green1 rounded-full">
        <div className="w-full h-max">
          <h3 className="text-3xl font-bold">PF</h3>
        </div>
      </div>

      <div className="w-10/12 ">
        <div className="flex justify-between content-center items-center">
          {" "}
          <h3 className="text-3xl font-bold">{props.name}</h3>
          <p className="text-l font-bold">
            ${props.amount}/{props.frequency}
          </p>
        </div>

        <p>Due Date: {new Date(date).toDateString()}</p>
      </div>
    </div>
  );
}

// flex flex-column basis-1/12 bg-green1 rounded-none sm:rounded-full w-1/3 content-center items-center h-full
