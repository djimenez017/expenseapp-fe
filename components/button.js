import React from "react";

export default function button(props) {
  return (
    <button
      className="bg-green1 w-full p-2 text-white text-xl font-bold"
      style={{ maxWidth: "650px" }}
      href={props.href}
      target={"_blank"}
      type={props.type}
    >
      {props.children}
    </button>
  );
}
