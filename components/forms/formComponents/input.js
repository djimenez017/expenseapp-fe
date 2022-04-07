import React from "react";

export default function input(props) {
  return (
    <div className="my-5 ">
      <label htmlFor={props.for}>
        {props.children}: <br />
        <input
          className="p-2 w-full"
          placeholder={props.placeholder}
          type={props.type}
          name={props.name}
          required={props.required}
        />
      </label>
    </div>
  );
}
