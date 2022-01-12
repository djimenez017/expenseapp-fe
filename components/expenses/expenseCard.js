import React from "react";

const expense = {
  id: 1,
  author: "Daniel Jimenez",
  addedDate: "1/7/2022",
  name: "Planet Fitness",
  category: "fitness",
  amount: 20.99,
  frequency: "monthly",
  dueDate: "1/20/2021",
};

export default function expenseCard() {
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
          <h3 className="text-3xl font-bold">Planet Fitness</h3>
          <p className="text-l font-bold">$20.99/mo</p>
        </div>

        <p>Due Date: 2/22/2022</p>
        <a href="https://planetfitness.com">Visit Website</a>
      </div>
    </div>
  );
}

// flex flex-column basis-1/12 bg-green1 rounded-none sm:rounded-full w-1/3 content-center items-center h-full
