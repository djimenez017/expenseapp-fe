import React, { useEffect, useState } from "react";
import Link from "next/link";
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
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-muted">Hello</p>
        <Link href="/profile">
          <a className="text-4xl text-ink hover:text-green">{fullName}</a>
        </Link>
      </div>
      <p className="text-sm text-muted">
        {expenseCount} {expenseCount === 1 ? "expense" : "expenses"}
      </p>
    </div>
  );
}
