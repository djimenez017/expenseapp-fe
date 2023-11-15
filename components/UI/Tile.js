import React from "react";

export default function Tile({ frequency, amount }) {
  return (
    <div className="bg-green text-white p-6 m-2 text-3xl w-36 h-36 flex flex-col justify-center items-center">
      <h2>{frequency}</h2>
      <p>${amount}</p>
    </div>
  );
}
