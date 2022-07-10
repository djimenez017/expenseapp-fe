import React from "react";
import Link from "next/link";

export default function button(props) {
  let whereTo = props.to;
  return (
    <Link href={`${whereTo}`} passHref>
      <button
        as="a"
        className="bg-green1 w-full p-2 text-white text-xl font-bold"
        style={{ maxWidth: "750px" }}
        type={props.type}
        onClick={props.click}
      >
        {props.children}
      </button>
    </Link>
  );
}
