import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Session from "../../components/hoc/session";
import Navigation from "../../components/Navigation/navigationBar";
import Title from "../../components/UI/Title";
import Input from "../../components/forms/formComponents/input";
import Select from "../../components/forms/formComponents/Select";
import Footer from "../../components/Navigation/footer";
import Submit from "../../components/forms/formComponents/Submit";
import Loading from "../../components/UI/Loading";
import { fetchExpense, updateExpense } from "../../components/lib/expenses";

const emptyForm = {
  name: "",
  amount: "",
  frequency: "MONTHLY",
  dateDue: "",
};

function EditForm() {
  const router = useRouter();
  const expenseId = router.query.id;
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!expenseId || Array.isArray(expenseId)) return undefined;
    let active = true;
    fetchExpense(expenseId)
      .then((expense) => {
        if (!active) return;
        setForm({
          name: expense.name,
          amount: expense.amount,
          frequency: expense.frequency,
          dateDue: String(expense.dateDue).slice(0, 10),
        });
        setError("");
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [expenseId]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateExpense(expenseId, form);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (!expenseId || loading) return <Loading />;
  if (saving) return <p>Updating</p>;

  return (
    <>
      <Navigation />
      <main
        className="container box-border p-2 space-y-4 flex h-screen justify-center items-center flex-col"
        style={{ maxWidth: "750px" }}
      >
        <Title>Edit Expense </Title>
        {error && (
          <div className="text-red-700 bg-red-200 p-2 w-full">
            <p>{error}</p>
          </div>
        )}
        <form autoComplete="off" onSubmit={onSubmit} className="w-full">
          <Input
            htmlFor="ExpenseName"
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={onChange}
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
            value={form.amount}
            onChange={onChange}
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
            value={form.frequency}
            onChange={onChange}
          >
            Frequency
          </Select>

          <Input
            htmlFor="date"
            id="date"
            name="dateDue"
            type="date"
            value={form.dateDue}
            onChange={onChange}
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
      <EditForm />
    </Session>
  );
}
