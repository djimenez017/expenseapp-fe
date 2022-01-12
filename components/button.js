import React from "react";

export default function button(props) {
  return (
    <button
      className="bg-green1 w-full p-3 text-white text-2xl font-bold"
      style={{ maxWidth: "650px" }}
      href={props.href}
      target={"_blank"}
    >
      {props.children}
    </button>
  );
}
