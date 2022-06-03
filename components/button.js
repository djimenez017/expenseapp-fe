import React from "react";

export default function button(props) {
  return (
    <button
      className="bg-green1 w-full p-2 text-white text-xl font-bold"
      style={{ maxWidth: "750px" }}
      href={props.href}
      target={"_blank"}
      type={props.type}
      onClick={props.click}
    >
      {props.children}
    </button>
  );
}
