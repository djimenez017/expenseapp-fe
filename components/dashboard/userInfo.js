import React from "react";

export default function userInfo({
  data: { fullName, emailAddress, username },
}) {
  return (
    <div className="bg-white p-6">
      <h1 className="text-grey text-4xl font-bold">{fullName}</h1>
      <p className="text-grey text-2xl font-bold">{emailAddress} </p>
      <p className="text-grey text-xl">username:{username} </p>
    </div>
  );
}
