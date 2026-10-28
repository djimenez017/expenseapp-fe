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
      const { data, error: queryError } = await supabase
        .from("expenses")
        .select("id, name, amount, frequency, date_due")
        .eq("id", expenseId)
        .maybeSingle();

      if (!active) return;

      if (queryError) setError(queryError.message);
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
    setSaving(true);
    setError("");

    const { error: updateError } = await supabase
      .from("expenses")
      .update({
        name: inputs.name,
        amount: parseFloat(inputs.amount),
        frequency: inputs.frequency,
        date_due: new Date(`${dueDate}T00:00:00`).toISOString(),
      })
      .eq("id", expenseId);

    if (updateError) {
      setSaving(false);
      setError(updateError.message);
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
