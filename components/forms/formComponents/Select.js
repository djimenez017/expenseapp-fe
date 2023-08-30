import React from "react";

export default function Select(props) {
  return (
    <>
      <label htmlFor={props.htmlFor}>
        {props.children}
        <select
          name={props.name}
          id={props.id}
          className={
            "appearance-none border-2 border-gray rounded w-full py-2 text-black leading-tight focus:outline-none focus:bg-white focus:border-green"
          }
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
