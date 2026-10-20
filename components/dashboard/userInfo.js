import React, { useEffect, useState } from "react";
import Loading from "../UI/Loading";
import { fetchProfile } from "../lib/expenses";

export default function UserInfo() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchProfile()
      .then((row) => {
        if (active) setProfile(row);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, []);

  if (error) return <p>Error</p>;
  if (!profile) return <Loading />;

  return (
    <div className="bg-white py-5">
      <h1 className="text-grey text-4xl font-bold">{profile.fullName}</h1>
      <p className="py-2 font-bold text-lg">
        Total Expenses:{" "}
        <span className="text-orange text-2xl">{profile.expenseCount}</span>
      </p>
    </div>
  );
}
