import React from "react";

export default function Select(props) {
  return (
    <>
      <label htmlFor={props.htmlFor}>
        {props.children}
        <select
          name={props.name}
          id={props.id}
          className={"p-2 w-full"}
          onChange={props.onChange}
        >
          <option value="DAILY">Daily</option>
          <option value="WEEKLY">Weekly</option>
          <option value="MONTHLY">Monthly</option>
          <option value="YEARLY">Yearly</option>
        </select>
      </label>
      <br />
      <br />
    </>
  );
}
