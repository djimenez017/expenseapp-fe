import React, { useState } from "react";
import { useRouter } from "next/router";
import Input from "../forms/formComponents/input";
import Select from "../forms/formComponents/Select";
import OptionSelect from "../forms/formComponents/OptionSelect";
import TagField from "../forms/formComponents/TagField";
import Submit from "../forms/formComponents/Submit";
import Loading from "../UI/Loading";
import { supabase } from "../lib/supabase";
import ensureProfile from "../lib/ensureProfile";
import { syncExpenseTags, useTagSuggestions } from "../lib/tags";
import {
  EXPENSE_KINDS,
  amountFieldLabel,
  dateFieldLabel,
  tracksBalance,
} from "../lib/expenseOptions";

export default function AddExpense() {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [expenseFrequency, setExpenseFrequency] = useState("DAILY");
  const [expenseKind, setExpenseKind] = useState("BILL");
  const [remainingBalance, setRemainingBalance] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { suggestions } = useTagSuggestions();
  const router = useRouter();

  const expenseSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      router.push("/");
      return;
    }

    const profileError = await ensureProfile(user);
    if (profileError) {
      setLoading(false);
      setError(profileError.message);
      return;
    }

    const expense = {
      user_id: user.id,
      name: expenseName,
      amount: parseFloat(expenseAmount),
      frequency: expenseFrequency,
      kind: expenseKind,
      remaining_balance: tracksBalance(expenseKind) ? parseFloat(remainingBalance) : null,
      date_due: new Date(`${expenseDate}T00:00:00`).toISOString(),
    };

    if (expenseKind === "CREDIT_CARD") expense.credit_limit = parseFloat(creditLimit);

    const { data: created, error: insertError } = await supabase
      .from("expenses")
      .insert(expense)
      .select("id")
      .single();

    if (insertError) {
      setLoading(false);
      setError(insertError.message);
      return;
    }

    const tagError = await syncExpenseTags(
      user.id,
      created.id,
      tags.map((tag) => tag.name)
    );

    if (tagError) {
      const { error: rollbackError } = await supabase
        .from("expenses")
        .delete()
        .eq("id", created.id);
      setLoading(false);
      setError(rollbackError ? `${tagError.message} ${rollbackError.message}` : tagError.message);
      return;
    }

    setLoading(false);

    router.push("/dashboard");
  };

  if (loading) return <Loading />;

  return (
    <>
      {error && <p className="mb-4 text-sm text-danger">{error}</p>}
      <form
        onSubmit={expenseSubmitHandler}
        autoComplete="off"
        className="panel"
      >
        <Input
          htmlFor="ExpenseName"
          id="ExpenseName"
          required
          onChange={(e) => setExpenseName(e.target.value)}
          name="name"
          value={expenseName}
          placeholder="Rent, Netflix, car loan"
          maxLength={120}
        >
          Expense Name
        </Input>
        <div className="grid gap-x-4 sm:grid-cols-2">
          <OptionSelect
            htmlFor="kind"
            name="kind"
            id="kind"
            value={expenseKind}
            onChange={(e) => setExpenseKind(e.target.value)}
            options={EXPENSE_KINDS}
          >
            Type
          </OptionSelect>
          <Select
            htmlFor="frequency"
            name="frequency"
            id="frequency"
            value={expenseFrequency}
            onChange={(e) => setExpenseFrequency(e.target.value)}
          >
            Frequency
          </Select>
          <Input
            htmlFor="amount"
            id="amount"
            required
            onChange={(e) => setExpenseAmount(e.target.value)}
            type="number"
            name="amount"
            value={expenseAmount}
            placeholder="0.00"
            step="0.01"
            min="0"
            max="9999999999.99"
            pattern="\d+(\.\d{1,2})?"
          >
            {amountFieldLabel(expenseKind)}
          </Input>
          <Input
            htmlFor="date"
            id="date"
            required
            onChange={(e) => setExpenseDate(e.target.value)}
            type="date"
            name="date"
            value={expenseDate}
          >
            {dateFieldLabel(expenseKind)}
          </Input>
          {tracksBalance(expenseKind) && (
            <Input
              htmlFor="remainingBalance"
              id="remainingBalance"
              required
              onChange={(e) => setRemainingBalance(e.target.value)}
              type="number"
              name="remainingBalance"
              value={remainingBalance}
              placeholder="0.00"
              step="0.01"
              min="0"
              pattern="\d+(\.\d{1,2})?"
            >
              Remaining balance
            </Input>
          )}
          {expenseKind === "CREDIT_CARD" && (
            <Input
              htmlFor="creditLimit"
              id="creditLimit"
              required
              onChange={(e) => setCreditLimit(e.target.value)}
              type="number"
              name="creditLimit"
              value={creditLimit}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              pattern="\d+(\.\d{1,2})?"
            >
              Credit limit
            </Input>
          )}
        </div>
        <TagField
          id="expenseTags"
          value={tags}
          suggestions={suggestions}
          onChange={setTags}
        />
        <Submit>Add expense</Submit>
      </form>
    </>
  );
}
