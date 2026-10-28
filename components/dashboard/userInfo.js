import React, { useEffect, useState } from "react";
import Loading from "../UI/Loading";
import { supabase } from "../lib/supabase";

export default function UserInfo() {
  const [fullName, setFullName] = useState("");
  const [expenseCount, setExpenseCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!active) return;

      if (userError || !user) {
        setError(userError?.message || "Not signed in");
        setLoading(false);
        return;
      }

      const [{ data: profile }, { count, error: countError }] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
        supabase.from("expenses").select("id", { count: "exact", head: true }),
      ]);

      if (!active) return;

      if (countError) {
        setError(countError.message);
        setLoading(false);
        return;
      }

      setFullName(profile?.full_name || user.email);
      setExpenseCount(count || 0);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  if (loading) return <Loading />;
  if (error) return <p>Error</p>;

  return (
    <div className="bg-white py-5">
      <h1 className="text-grey text-4xl font-bold">{fullName}</h1>
      <p className="py-2 font-bold text-lg">
        Total Expenses:{" "}
        <span className="text-orange text-2xl">{expenseCount}</span>
      </p>
    </div>
  );
}
