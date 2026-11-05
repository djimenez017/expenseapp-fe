import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { formatDollars, formatDueDay, nextDueDate } from "../lib/leftover";
import {
  EXPENSE_FREQUENCIES,
  EXPENSE_KINDS,
  aboveRecommendedUse,
  cardUtilization,
  formatUtilization,
  tracksBalance,
} from "../lib/expenseOptions";
import TagChips from "../tags/tagChips";

export function MetaLine({ parts }) {
  const shown = parts.filter((part) => part && part.text);
  if (shown.length === 0) return null;
  const onDesktop = shown.some((part) => !part.mobileOnly);
  let desktopBefore = false;

  return (
    <p className={`mt-0.5 text-sm text-muted ${onDesktop ? "" : "md:hidden"}`}>
      {shown.map((part, index) => {
        const separatorOnDesktop = !part.mobileOnly && desktopBefore;
        if (!part.mobileOnly) desktopBefore = true;
        return (
          <span key={part.key} className={part.mobileOnly ? "md:hidden" : ""}>
            {index > 0 && <span className={separatorOnDesktop ? "" : "md:hidden"}> · </span>}
            <span className={`whitespace-nowrap ${part.className || ""}`}>{part.text}</span>
          </span>
        );
      })}
    </p>
  );
}

function duePhrase(kind, frequency, date) {
  if (frequency === "DAILY") return "Every day";
  if (!date) return "";
  const when = formatDueDay(date);
  if (kind === "SUBSCRIPTION") return `Renews ${when}`;
  if (tracksBalance(kind)) return `Next payment ${when}`;
  return `Due ${when}`;
}

export default function ExpenseRow({ expense, showKind, onTagSelect, onChanged }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const kind = expense.kind || "BILL";
  const balance =
    expense.remaining_balance == null || expense.remaining_balance === ""
      ? null
      : Number(expense.remaining_balance);
  const hasBalance = tracksBalance(kind);
  const paidOff = hasBalance && balance != null && balance <= 0;
  const canRecordPayment = hasBalance && balance != null && balance > 0;
  const used = kind === "CREDIT_CARD" ? cardUtilization(balance, expense.credit_limit) : null;
  const highUse = aboveRecommendedUse(used);
  const kindLabel = EXPENSE_KINDS.find((item) => item.value === kind)?.label || "Bill";
  const schedule =
    EXPENSE_FREQUENCIES.find((item) => item.value === expense.frequency)?.label || expense.frequency;
  const due = duePhrase(kind, expense.frequency, nextDueDate(expense));

  const recordPayment = async () => {
    setBusy(true);
    setError("");

    const nextBalance = Math.max(0, Math.round((balance - Number(expense.amount)) * 100) / 100);
    const { error: updateError } = await supabase
      .from("expenses")
      .update({ remaining_balance: nextBalance })
      .eq("id", expense.id);

    setBusy(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    if (onChanged) onChanged();
  };

  const balanceText = paidOff
    ? "Paid off"
    : balance == null
    ? null
    : kind === "CREDIT_CARD" && expense.credit_limit
    ? `${formatDollars(balance)} of ${formatDollars(expense.credit_limit)}`
    : `${formatDollars(balance)} left`;

  return (
    <li className="relative px-4 py-3 transition-colors hover:bg-paper/50 sm:px-5">
      <div className="flex items-start gap-4 md:grid md:grid-cols-[minmax(0,1fr)_11rem_9rem] md:items-center">
        <div className="min-w-0 flex-1">
          <Link href={`/edit/${expense.id}`}>
            <a className="block truncate font-semibold text-ink after:absolute after:inset-0 after:content-['']">
              {expense.name}
            </a>
          </Link>
          <MetaLine
            parts={[
              showKind && { key: "kind", text: kindLabel },
              { key: "due", text: due, mobileOnly: true },
              balanceText && {
                key: "balance",
                text: balanceText,
                className: paidOff ? "font-bold text-green" : "",
              },
              used != null && {
                key: "used",
                text: `${formatUtilization(used)} used`,
                className: `font-bold ${highUse ? "text-danger" : "text-green"}`,
              },
            ]}
          />
          {(expense.tags?.length > 0 || canRecordPayment) && (
            <div className="relative z-10 mt-2 flex flex-wrap items-center gap-2">
              <TagChips tags={expense.tags} onSelect={onTagSelect} />
              {canRecordPayment && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={recordPayment}
                  className="rounded-full border border-green/30 px-3 py-1 text-xs font-bold text-green transition-colors hover:border-green hover:bg-green hover:text-white disabled:opacity-60"
                >
                  {busy ? "Saving…" : `Record ${formatDollars(expense.amount)} payment`}
                </button>
              )}
            </div>
          )}
          {error && <p className="relative z-10 mt-2 text-sm text-danger">{error}</p>}
        </div>
        <p className="hidden text-sm text-muted md:block">{due}</p>
        <div className="shrink-0 text-right">
          <p className="font-semibold tabular-nums text-ink">{formatDollars(expense.amount)}</p>
          <p className="text-xs text-muted">{schedule}</p>
        </div>
      </div>
    </li>
  );
}
