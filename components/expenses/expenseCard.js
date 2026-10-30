import React, { useState } from "react";
import Link from "next/link";
import formatDate from "../lib/formatDate";
import formatDateExtension from "../lib/formatDateExtension";
import Loading from "../UI/Loading";
import { supabase } from "../lib/supabase";
import { formatDollars } from "../lib/leftover";

export default function ExpenseCard(props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nextPayment = formatDate(props.frequency, new Date(props.dateDue));
  const balance =
    props.remainingBalance == null || props.remainingBalance === ""
      ? null
      : Number(props.remainingBalance);
  const paidOff = props.kind === "LOAN" && balance != null && balance <= 0;
  const canRecordPayment = props.kind === "LOAN" && balance != null && balance > 0;
  const when = props.frequency.toLowerCase();
  const ordinal = formatDateExtension(nextPayment.getDate() + 1);
  const lead =
    props.kind === "SUBSCRIPTION"
      ? "Renews"
      : props.kind === "LOAN"
      ? "Next payment"
      : "Due";

  const deleteHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: deleteError } = await supabase
      .from("expenses")
      .delete()
      .eq("id", props.id);

    setLoading(false);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    if (props.onDeleted) props.onDeleted();
  };

  const recordPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const nextBalance = Math.max(
      0,
      Math.round((balance - Number(props.amount)) * 100) / 100
    );

    const { error: updateError } = await supabase
      .from("expenses")
      .update({ remaining_balance: nextBalance })
      .eq("id", props.id);

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    if (props.onDeleted) props.onDeleted();
  };

  if (loading) return <Loading />;

  return (
    <article className="rounded-2xl border border-line bg-white px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl">{props.name}</h3>
          <p className="text-sm text-muted">
            {lead} {when}, every {ordinal}
            {props.kind === "LOAN"
              ? ` · ${balance == null ? "balance open" : formatDollars(balance) + " left"}`
              : ""}
            {paidOff ? " · Paid off" : ""}
          </p>
        </div>
        <p className="text-right text-xl">
          {formatDollars(props.amount)}
          <span className="mt-0.5 block text-xs font-bold uppercase tracking-widest text-muted">
            {props.frequency}
          </span>
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-sm font-bold">
        <Link href={`/edit/${props.id}`}>
          <a className="text-green hover:text-ink">Edit</a>
        </Link>
        {canRecordPayment && (
          <button type="button" className="text-green hover:text-ink" onClick={recordPayment}>
            Record payment
          </button>
        )}
        <button type="button" className="text-clay hover:text-ink" onClick={deleteHandler}>
          Delete
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </article>
  );
}
