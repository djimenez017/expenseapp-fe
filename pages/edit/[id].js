import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useForm from "../../components/lib/useForm";
import Session from "../../components/hoc/session";
import Navigation from "../../components/Navigation/navigationBar";
import Title from "../../components/UI/Title";
import Input from "../../components/forms/formComponents/input";
import Select from "../../components/forms/formComponents/Select";
import OptionSelect from "../../components/forms/formComponents/OptionSelect";
import TagField from "../../components/forms/formComponents/TagField";
import Footer from "../../components/Navigation/footer";
import Submit from "../../components/forms/formComponents/Submit";
import Loading from "../../components/UI/Loading";
import { supabase } from "../../components/lib/supabase";
import {
  EXPENSE_KINDS,
  amountFieldLabel,
  dateFieldLabel,
  isPaymentApp,
  tracksBalance,
} from "../../components/lib/expenseOptions";
import { loadExpense, syncExpenseTags, useTagSuggestions } from "../../components/lib/tags";
import BackLink from "../../components/UI/BackLink";

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
  const [tags, setTags] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { suggestions } = useTagSuggestions();
  const { inputs, handleChange } = useForm(expense || {});

  useEffect(() => {
    if (!router.isReady || Number.isNaN(expenseId)) return;

    let active = true;

    (async () => {
      const { data, error: queryError } = await loadExpense(expenseId);

      if (!active) return;

      if (queryError) setError(queryError.message);
      if (data) {
        const { tags: loadedTags, ...expenseRow } = data;
        setExpense(expenseRow);
        setTags(loadedTags || []);
      } else {
        setExpense(null);
        setTags([]);
      }
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      router.push("/");
      return;
    }

    const paymentApp = isPaymentApp(inputs.kind);
    const updates = {
      name: inputs.name,
      amount: paymentApp ? 0 : parseFloat(inputs.amount),
      frequency: paymentApp ? inputs.frequency || "MONTHLY" : inputs.frequency,
      kind: inputs.kind || "BILL",
      remaining_balance: paymentApp
        ? expense.remaining_balance ?? 0
        : tracksBalance(inputs.kind)
          ? parseFloat(inputs.remaining_balance)
          : null,
      date_due: new Date(`${dueDate || toDateInput(new Date())}T00:00:00`).toISOString(),
    };

    if (inputs.kind === "CREDIT_CARD") {
      updates.credit_limit = parseFloat(inputs.credit_limit);
    } else if (inputs.credit_limit != null && inputs.credit_limit !== "") {
      updates.credit_limit = null;
    }

    const { error: updateError } = await supabase
      .from("expenses")
      .update(updates)
      .eq("id", expenseId);

    if (updateError) {
      setSaving(false);
      setError(updateError.message);
      return;
    }

    const tagError = await syncExpenseTags(
      user.id,
      expenseId,
      tags.map((tag) => tag.name)
    );

    if (tagError) {
      setSaving(false);
      setError(tagError.message);
      return;
    }

    router.push("/dashboard");
  };

  const deleteExpense = async () => {
    setDeleting(true);
    setError("");

    const { error: deleteError } = await supabase.from("expenses").delete().eq("id", expenseId);

    if (deleteError) {
      setDeleting(false);
      setError(deleteError.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <>
      <Navigation />
      <main className="shell space-y-5">
        <BackLink />
        <Title>Edit expense</Title>
        {error && <p className="text-sm text-danger">{error}</p>}
        <form className="panel" autoComplete="off" onSubmit={saveExpense}>
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
          <div className="grid gap-x-4 sm:grid-cols-2">
            <OptionSelect
              htmlFor="kind"
              name="kind"
              id="kind"
              value={inputs.kind || "BILL"}
              onChange={handleChange}
              options={EXPENSE_KINDS}
            >
              Type
            </OptionSelect>
            {!isPaymentApp(inputs.kind) && (
              <Select
                htmlFor="frequency"
                name="frequency"
                id="frequency"
                value={inputs.frequency || "DAILY"}
                onChange={handleChange}
              >
                Frequency
              </Select>
            )}
            {!isPaymentApp(inputs.kind) && (
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
                {amountFieldLabel(inputs.kind)}
              </Input>
            )}
            {!isPaymentApp(inputs.kind) && (
              <Input
                htmlFor="date"
                id="date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              >
                {dateFieldLabel(inputs.kind)}
              </Input>
            )}
            {tracksBalance(inputs.kind) && (
              <Input
                htmlFor="remainingBalance"
                id="remaining_balance"
                required
                type="number"
                name="remaining_balance"
                value={inputs.remaining_balance ?? ""}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                pattern="\d+(\.\d{1,2})?"
              >
                Remaining balance
              </Input>
            )}
            {inputs.kind === "CREDIT_CARD" && (
              <Input
                htmlFor="creditLimit"
                id="credit_limit"
                required
                type="number"
                name="credit_limit"
                value={inputs.credit_limit ?? ""}
                onChange={handleChange}
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
          <Submit>Save changes</Submit>
        </form>
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3 sm:px-5">
          {confirmDelete ? (
            <>
              <p className="text-sm text-ink">
                Delete <span className="font-bold">{expense.name}</span>? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="min-h-[40px] rounded-full px-4 text-sm font-bold text-muted hover:text-ink"
                >
                  Keep it
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={deleteExpense}
                  className="min-h-[40px] rounded-full bg-danger px-4 text-sm font-bold text-white hover:bg-ink disabled:opacity-60"
                >
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-muted">No longer paying for this?</p>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="min-h-[40px] rounded-full px-4 text-sm font-bold text-danger ring-1 ring-inset ring-danger/40 hover:bg-danger hover:text-white"
              >
                Delete expense
              </button>
            </>
          )}
        </section>
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
