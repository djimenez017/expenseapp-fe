import React, { useState } from "react";
import Input from "../forms/formComponents/input";
import Submit from "../forms/formComponents/Submit";
import { supabase } from "../lib/supabase";
import ensureProfile from "../lib/ensureProfile";
import { formatDollars, parseSpentOn } from "../lib/leftover";

function todayInput() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function SpendingLog({ items, onChanged }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [spentOn, setSpentOn] = useState(todayInput);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

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

    const { error: insertError } = await supabase.from("spending").insert({
      user_id: user.id,
      name,
      amount: parseFloat(amount),
      spent_on: spentOn,
    });

    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setName("");
    setAmount("");
    setSpentOn(todayInput());
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

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl">Spending this month</h2>
        <span className="text-sm text-muted">{items.length}</span>
      </div>
      <form onSubmit={addSpending} autoComplete="off" className="panel">
        <Input
          htmlFor="spendingName"
          id="spendingName"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        >
          Purchase
        </Input>
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
        {error && <p className="mb-4 text-sm text-danger">{error}</p>}
        <Submit>Log purchase</Submit>
        {saving && <p className="pt-2">Saving</p>}
      </form>
      {items.length === 0 ? (
        <p className="text-muted">None yet.</p>
      ) : (
        <ul className="divide-y divide-line rounded-2xl border border-line bg-white px-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-muted">
                  {parseSpentOn(item.spent_on).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold">{formatDollars(item.amount)}</span>
                <button
                  type="button"
                  className="text-sm font-bold text-clay hover:text-ink"
                  onClick={() => deleteSpending(item.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
