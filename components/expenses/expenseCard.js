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
  isPaymentApp,
  tracksBalance,
} from "../lib/expenseOptions";

function todayDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function roundMoney(value) {
  return Math.round(Number(value) * 100) / 100;
}
import TagChips from "../tags/tagChips";

export function MetaLine({ parts }) {
  const shown = parts.filter((part) => part && part.text);
  if (shown.length === 0) return null;
  const onDesktop = shown.some((part) => !part.mobileOnly);
  const firstDesktop = shown.findIndex((part) => !part.mobileOnly);

  return (
    <p className={`mt-0.5 text-sm text-muted ${onDesktop ? "" : "md:hidden"}`}>
      {shown.map((part, index) => {
        const separatorOnDesktop = !part.mobileOnly && index !== firstDesktop;
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
  if (kind === "PAYMENT_APP") return "";
  if (tracksBalance(kind)) return `Next payment ${when}`;
  return `Due ${when}`;
}

export default function ExpenseRow({ expense, showKind, onTagSelect, onChanged }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  const kind = expense.kind || "BILL";
  const paymentApp = isPaymentApp(kind);
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

  const recordTransfer = async (direction) => {
    const value = roundMoney(parseFloat(transferAmount));
    if (!value || value <= 0) {
      setError("Enter an amount.");
      return;
    }

    const current = balance == null ? 0 : balance;
    const nextBalance = roundMoney(direction === "SENT" ? current - value : current + value);
    if (nextBalance < 0) {
      setError("That is more than the balance.");
      return;
    }

    setBusy(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setBusy(false);
      setError("Sign in again to record this.");
      return;
    }

    const { data: created, error: insertError } = await supabase
      .from("transfers")
      .insert({
        user_id: user.id,
        expense_id: expense.id,
        direction,
        amount: value,
        transferred_on: todayDate(),
      })
      .select("id")
      .single();

    if (insertError) {
      setBusy(false);
      setError(
        /transfers|schema cache/i.test(insertError.message)
          ? "Payment apps are not set up yet. Run the latest SQL migration, then try again."
          : insertError.message
      );
      return;
    }

    const { error: updateError } = await supabase
      .from("expenses")
      .update({ remaining_balance: nextBalance })
      .eq("id", expense.id);

    if (updateError) {
      await supabase.from("transfers").delete().eq("id", created.id);
      setBusy(false);
      setError(updateError.message);
      return;
    }

    setBusy(false);
    setTransferAmount("");
    if (onChanged) onChanged();
  };

  const balanceText = paymentApp
    ? `${formatDollars(balance || 0)} balance`
    : paidOff
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
          <Link
            href={`/edit/${expense.id}`}
            className="block truncate font-semibold text-ink after:absolute after:inset-0 after:content-['']"
          >
            {expense.name}
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
          {(expense.tags?.length > 0 || canRecordPayment || paymentApp) && (
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
              {paymentApp && (
                <>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0.01"
                    step="0.01"
                    value={transferAmount}
                    onChange={(event) => setTransferAmount(event.target.value)}
                    aria-label={`Amount for ${expense.name}`}
                    placeholder="0.00"
                    className="w-24 rounded-full border border-line bg-white px-3 py-1 text-sm text-ink"
                  />
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => recordTransfer("RECEIVED")}
                    className="rounded-full border border-green/30 px-3 py-1 text-xs font-bold text-green transition-colors hover:border-green hover:bg-green hover:text-white disabled:opacity-60"
                  >
                    Received
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => recordTransfer("SENT")}
                    className="rounded-full border border-ink/20 px-3 py-1 text-xs font-bold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:opacity-60"
                  >
                    Sent
                  </button>
                </>
              )}
            </div>
          )}
          {error && <p className="relative z-10 mt-2 text-sm text-danger">{error}</p>}
        </div>
        <p className="hidden text-sm text-muted md:block">{due}</p>
        <div className="shrink-0 text-right">
          <p className="font-semibold tabular-nums text-ink">
            {formatDollars(paymentApp ? balance || 0 : expense.amount)}
          </p>
          <p className="text-xs text-muted">{paymentApp ? "Balance" : schedule}</p>
        </div>
      </div>
    </li>
  );
}
