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
    <div className="p-5 bg-[white] rounded-lg flex flex-row space-x-4 w-full box-border	">
      <div className="flex flex-column justify-center basis-1/12 bg-[gray] rounded-full w-1/12">
        <h3 className=" p-8 text-3xl font-bold">PF</h3>
      </div>
      <div className="bg-[gray] w-full ">
        <h3>Gym</h3>
        <p>Date Added: 1/22/2022</p>
        <p>$20.99/month</p>
        <p>Due Date: 2/22/2022</p>
      </div>
    </div>
  );
}
