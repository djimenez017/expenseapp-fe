import React from "react";

export default function input(props) {
  return (
    <label htmlFor={props.htmlFor} className="mb-4 block text-sm font-bold text-muted">
      {props.children}
      <input
        id={props.id}
        onChange={props.onChange}
        className="mt-1 w-full rounded-2xl border border-line bg-white px-4 py-3 text-base font-normal text-ink outline-none focus:border-green"
        value={props.value}
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        step={props.step}
        pattern={props.pattern}
        min={props.min}
        required
      />
    </label>
  );
}
