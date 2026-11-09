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
  isPaymentApp,
  tracksBalance,
} from "../lib/expenseOptions";

const MONEY_DIRECTIONS = [
  { value: "IN", label: "Money in" },
  { value: "OUT", label: "Money out" },
];

function todayDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function roundMoney(value) {
  return Math.round(Number(value) * 100) / 100;
}

export default function AddExpense() {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [expenseFrequency, setExpenseFrequency] = useState("DAILY");
  const [expenseKind, setExpenseKind] = useState("BILL");
  const [remainingBalance, setRemainingBalance] = useState("");
  const [moneyDirection, setMoneyDirection] = useState("IN");
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

    const paymentApp = isPaymentApp(expenseKind);
    const movement = roundMoney(parseFloat(expenseAmount));
    if (paymentApp && (!movement || movement <= 0)) {
      setLoading(false);
      setError("Enter an amount.");
      return;
    }

    const moneyIn = moneyDirection === "IN";
    const expense = {
      user_id: user.id,
      name: expenseName,
      amount: paymentApp ? 0 : parseFloat(expenseAmount),
      frequency: paymentApp ? "MONTHLY" : expenseFrequency,
      kind: expenseKind,
      remaining_balance: paymentApp
        ? moneyIn
          ? movement
          : 0
        : tracksBalance(expenseKind)
          ? parseFloat(remainingBalance)
          : null,
      date_due: new Date(`${(paymentApp ? todayDate() : expenseDate)}T00:00:00`).toISOString(),
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

    if (paymentApp) {
      const { error: transferError } = await supabase.from("transfers").insert({
        user_id: user.id,
        expense_id: created.id,
        direction: moneyIn ? "RECEIVED" : "SENT",
        amount: movement,
        transferred_on: todayDate(),
      });

      if (transferError) {
        await supabase.from("expenses").delete().eq("id", created.id);
        setLoading(false);
        setError(
          /transfers|schema cache/i.test(transferError.message)
            ? "Payment apps are not set up yet. Run the latest SQL migration, then try again."
            : transferError.message
        );
        return;
      }
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
          {!isPaymentApp(expenseKind) && (
            <Select
              htmlFor="frequency"
              name="frequency"
              id="frequency"
              value={expenseFrequency}
              onChange={(e) => setExpenseFrequency(e.target.value)}
            >
              Frequency
            </Select>
          )}
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
          {isPaymentApp(expenseKind) && (
            <OptionSelect
              htmlFor="moneyDirection"
              name="moneyDirection"
              id="moneyDirection"
              value={moneyDirection}
              onChange={(e) => setMoneyDirection(e.target.value)}
              options={MONEY_DIRECTIONS}
            >
              Money
            </OptionSelect>
          )}
          {!isPaymentApp(expenseKind) && (
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
          )}
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
