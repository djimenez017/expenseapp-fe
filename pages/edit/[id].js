import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useForm from "../../components/lib/useForm";
import Session from "../../components/hoc/session";
import Navigation from "../../components/Navigation/navigationBar";
import Title from "../../components/UI/Title";
import Input from "../../components/forms/formComponents/input";
import Select from "../../components/forms/formComponents/Select";
import Footer from "../../components/Navigation/footer";
import Submit from "../../components/forms/formComponents/Submit";
import Loading from "../../components/UI/Loading";
import { getCurrentUser } from "../../components/lib/currentUser";
import { parseExpense } from "../../components/lib/expenseFields";
import { EXPENSE_NAME_MAX, messages } from "../../components/lib/limits";
import { supabase } from "../../components/lib/supabase";

function toDateInput(value) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function EditExpenseForm() {
  const router = useRouter();
  const expenseId = parseInt(router.query.id, 10);
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dueDate, setDueDate] = useState("");
  const { inputs, handleChange } = useForm(expense || {});

  useEffect(() => {
    if (!router.isReady || Number.isNaN(expenseId)) return;

    let active = true;

    (async () => {
      const user = await getCurrentUser();
      if (!active) return;

      if (!user) {
        setError(messages.loadExpenseFailed);
        setLoading(false);
        return;
      }

      const { data, error: queryError } = await supabase
        .from("expenses")
        .select("id, name, amount, frequency, date_due")
        .eq("id", expenseId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (!active) return;

      if (queryError) setError(messages.loadExpenseFailed);
      setExpense(data);
      if (data?.date_due) setDueDate(toDateInput(data.date_due));
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [router.isReady, expenseId]);

  if (loading) return <Loading />;
  if (saving) return <p>Updating</p>;
  if (!expense) return <p>{error || "Expense not found"}</p>;

  const saveExpense = async (e) => {
    e.preventDefault();
    setError("");

    const parsed = parseExpense({
      name: inputs.name,
      amount: inputs.amount,
      frequency: inputs.frequency,
      date: dueDate,
    });
    if (parsed.error) {
      setError(parsed.error);
      return;
    }

    setSaving(true);

    const user = await getCurrentUser();
    if (!user) {
      setSaving(false);
      setError(messages.saveExpenseFailed);
      return;
    }

    const { error: updateError } = await supabase
      .from("expenses")
      .update({
        name: parsed.name,
        amount: parsed.amount,
        frequency: parsed.frequency,
        date_due: parsed.dateDue,
      })
      .eq("id", expenseId)
      .eq("user_id", user.id);

    if (updateError) {
      setSaving(false);
      setError(messages.saveExpenseFailed);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <>
      <Navigation />
      <main
        className="container box-border p-2 space-y-4 flex h-screen justify-center items-center flex-col"
        style={{ maxWidth: "750px" }}
      >
        <Title>Edit Expense </Title>
        {error && <p className="text-red-700">{error}</p>}
        <form autoComplete="off" onSubmit={saveExpense}>
          <Input
            htmlFor="ExpenseName"
            id="name"
            name="name"
            type="text"
            value={inputs.name || ""}
            onChange={handleChange}
            maxLength={EXPENSE_NAME_MAX}
            required
          >
            Expense Name
          </Input>
          <Input
            htmlFor="amount"
            id="amount"
            required
            type="number"
            name="amount"
            value={inputs.amount ?? ""}
            onChange={handleChange}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            pattern="\d+(\.\d{1,2})?"
          >
            Amount
          </Input>
          <Select
            htmlFor="frequency"
            name="frequency"
            id="frequency"
            value={inputs.frequency || "DAILY"}
            onChange={handleChange}
          >
            Frequency
          </Select>

          <Input
            htmlFor="date"
            id="date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          >
            Due Date
          </Input>
          <Submit />
        </form>
      </main>
      <Footer />
    </>
  );
}

export default function SingleExpense() {
  return (
    <Session>
      <EditExpenseForm />
    </Session>
  );
}
