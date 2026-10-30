import React from "react";

const field =
  "mt-1 w-full appearance-none rounded-2xl border border-line bg-white bg-[length:14px] bg-[right_1rem_center] bg-no-repeat px-4 py-3 pr-10 text-base font-normal text-ink outline-none focus:border-green bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2012%208%27%3E%3Cpath%20fill=%27%231e2a22%27%20d=%27M1%201l5%205%205-5%27/%3E%3C/svg%3E')]";

export default function OptionSelect(props) {
  return (
    <label htmlFor={props.htmlFor} className="mb-4 block text-sm font-bold text-muted">
      {props.children}
      <select
        name={props.name}
        id={props.id}
        className={field}
        onChange={props.onChange}
        value={props.value}
      >
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
