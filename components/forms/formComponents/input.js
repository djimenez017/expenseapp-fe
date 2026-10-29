import React from "react";

export default function input(props) {
  return (
    <>
      <label htmlFor={props.htmlFor} className="block mb-4">
        {props.children}
        <input
          id={props.id}
          onChange={props.onChange}
          className="appearance-none border-2 border-gray rounded w-full py-2 px-4 text-black leading-tight focus:outline-none focus:bg-white focus:border-green"
          value={props.value}
          type={props.type}
          name={props.name}
          placeholder={props.placeholder}
          step={props.step}
          pattern={props.pattern}
          min={props.min}
          minLength={props.minLength}
          maxLength={props.maxLength}
          autoComplete={props.autoComplete}
          required
        />
      </label>
    </>
  );
}
