import React, { useState } from "react";
import Input from "../forms/formComponents/input";
import TagField from "../forms/formComponents/TagField";
import Submit from "../forms/formComponents/Submit";
import TagChips from "../tags/tagChips";
import { supabase } from "../lib/supabase";
import ensureProfile from "../lib/ensureProfile";
import { syncSpendingTags, useTagSuggestions } from "../lib/tags";
import { formatDollars, formatShortDate } from "../lib/leftover";

function todayInput() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function SpendingLog({
  items,
  onChanged,
  onTagSelect,
  hideHeading,
  hideForm,
  showKind,
  totalLabel = "Total this month",
  emptyText = "No purchases this month yet. Log one to see it come out of the month.",
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [spentOn, setSpentOn] = useState(todayInput);
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const { suggestions, refreshSuggestions } = useTagSuggestions();

  const addSpending = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      setError("Not signed in");
      return;
    }

    const profileError = await ensureProfile(user);
    if (profileError) {
      setSaving(false);
      setError(profileError.message);
      return;
    }

    const { data: created, error: insertError } = await supabase
      .from("spending")
      .insert({
        user_id: user.id,
        name,
        amount: parseFloat(amount),
        spent_on: spentOn,
      })
      .select("id")
      .single();

    if (insertError) {
      setSaving(false);
      setError(insertError.message);
      return;
    }

    const tagError = await syncSpendingTags(
      user.id,
      created.id,
      tags.map((tag) => tag.name)
    );

    if (tagError) {
      const { error: rollbackError } = await supabase
        .from("spending")
        .delete()
        .eq("id", created.id);
      setSaving(false);
      setError(rollbackError ? `${tagError.message} ${rollbackError.message}` : tagError.message);
      return;
    }

    setSaving(false);
    setName("");
    setAmount("");
    setSpentOn(todayInput());
    setTags([]);
    setFormOpen(false);
    refreshSuggestions();
    if (onChanged) onChanged();
  };

  const deleteSpending = async (id) => {
    setError("");
    const { error: deleteError } = await supabase
      .from("spending")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    if (onChanged) onChanged();
  };

  const monthTotal = items.reduce((total, item) => total + Number(item.amount || 0), 0);

  return (
    <section className="space-y-4">
      {!hideHeading && (
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Spending this month</h2>
          <span className="text-sm text-muted">{items.length}</span>
        </div>
      )}
      {!hideForm && (
        <>
          <button
            type="button"
            aria-expanded={formOpen}
            aria-controls="spendingForm"
            onClick={() => setFormOpen(!formOpen)}
            className={`min-h-[44px] w-full rounded-full font-bold transition-colors md:hidden ${
              formOpen ? "border border-line bg-white text-ink" : "bg-green text-white"
            }`}
          >
            {formOpen ? "Cancel" : "Log a purchase"}
          </button>
          <form
            id="spendingForm"
            onSubmit={addSpending}
            autoComplete="off"
            className={`panel ${formOpen ? "block" : "hidden"} md:block`}
          >
            <div className="grid gap-x-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
              <div className="sm:col-span-2 lg:col-span-1">
                <Input
                  htmlFor="spendingName"
                  id="spendingName"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Groceries, gas, coffee"
                >
                  Purchase
                </Input>
              </div>
              <Input
                htmlFor="spendingAmount"
                id="spendingAmount"
                type="number"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                pattern="\d+(\.\d{1,2})?"
              >
                Amount
              </Input>
              <Input
                htmlFor="spentOn"
                id="spentOn"
                type="date"
                name="spentOn"
                value={spentOn}
                onChange={(e) => setSpentOn(e.target.value)}
              >
                Date
              </Input>
            </div>
            <div className="grid gap-x-4 md:grid-cols-[minmax(0,1fr)_12rem] md:items-start">
              <TagField
                id="spendingTags"
                value={tags}
                suggestions={suggestions}
                onChange={setTags}
              />
              <div className="md:pt-4">
                <Submit>{saving ? "Saving…" : "Log purchase"}</Submit>
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-danger">{error}</p>}
          </form>
        </>
      )}
      {hideForm && error && <p className="text-sm text-danger">{error}</p>}
      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
          {emptyText}
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="hidden border-b border-line bg-paper/70 px-5 py-2 text-xs font-semibold text-muted sm:grid sm:grid-cols-[5.5rem_minmax(0,1.6fr)_minmax(0,1fr)_6.5rem_4.5rem] sm:gap-x-3">
            <span>Date</span>
            <span>Description</span>
            <span>Category</span>
            <span className="text-right">Amount</span>
            <span className="sr-only">Actions</span>
          </div>
          <ul className="divide-y divide-line">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-3 px-4 py-3 sm:grid sm:grid-cols-[5.5rem_minmax(0,1.6fr)_minmax(0,1fr)_6.5rem_4.5rem] sm:items-center sm:gap-x-3 sm:px-5"
              >
                <span className="hidden text-sm text-muted sm:block">
                  {formatShortDate(item.spent_on)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{item.name}</p>
                  {showKind && <p className="mt-0.5 hidden text-sm text-muted sm:block">Spending</p>}
                  <p className="mt-0.5 text-sm text-muted sm:hidden">
                    {showKind ? `Spending · ${formatShortDate(item.spent_on)}` : formatShortDate(item.spent_on)}
                  </p>
                  {item.tags?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2 sm:hidden">
                      <TagChips tags={item.tags} onSelect={onTagSelect} />
                    </div>
                  )}
                </div>
                <div className="hidden min-w-0 sm:block">
                  {item.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <TagChips tags={item.tags} onSelect={onTagSelect} />
                    </div>
                  )}
                </div>
                <span className="shrink-0 pt-px text-right font-semibold tabular-nums sm:pt-0">
                  {formatDollars(item.amount)}
                </span>
                <button
                  type="button"
                  aria-label={`Delete ${item.name}`}
                  className="-my-1 -mr-2 shrink-0 justify-self-end rounded-full px-2 py-1 text-sm font-bold text-clay hover:bg-paper hover:text-ink sm:mr-0"
                  onClick={() => deleteSpending(item.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          {!hideHeading || !hideForm ? (
            <p className="flex items-baseline justify-between gap-4 border-t border-line px-4 py-4 text-base text-muted sm:px-5 sm:py-5">
              <span>{totalLabel}</span>
              <span className="text-2xl font-semibold tabular-nums text-ink">
                {formatDollars(monthTotal)}
              </span>
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}
