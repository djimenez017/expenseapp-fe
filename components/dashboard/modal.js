import React from "react";

export default function modal({ open, children }) {
  if (open === false) return null;
  return (
    <div className="z-999 bg-white h-screen w-screen	">
      <div className="z-1000 bg-green w-2/4">{children}</div>
    </div>
  );
}
