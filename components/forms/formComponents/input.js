import React from "react";

export default function input(props) {
  return (
    <>
      <label htmlFor={props.htmlFor}>
        {props.children}
        <input
          id={props.id}
          onChange={props.onChange}
          className="p-2 w-full"
          value={props.value}
          type={props.type}
          name={props.name}
          required
        />
      </label>
      <br />
      <br />
    </>
  );
}
