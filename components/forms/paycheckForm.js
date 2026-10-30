import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Input from "./formComponents/input";
import OptionSelect from "./formComponents/OptionSelect";
import Submit from "./formComponents/Submit";
import Loading from "../UI/Loading";
import { supabase } from "../lib/supabase";
import ensureProfile from "../lib/ensureProfile";
import { PAY_SCHEDULES } from "../lib/expenseOptions";

export default function PaycheckForm() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [schedule, setSchedule] = useState("BIWEEKLY");
  const [nextPayday, setNextPayday] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      const { data, error: queryError } = await supabase
        .from("paychecks")
        .select("amount, schedule, next_payday")
        .maybeSingle();

      if (!active) return;

      if (queryError) setError(queryError.message);
      if (data) {
        setAmount(data.amount);
        setSchedule(data.schedule);
        setNextPayday(data.next_payday ? String(data.next_payday).slice(0, 10) : "");
      }
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  const savePaycheck = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      router.push("/");
      return;
    }

    const profileError = await ensureProfile(user);
    if (profileError) {
      setSaving(false);
      setError(profileError.message);
      return;
    }

    const { error: saveError } = await supabase.from("paychecks").upsert(
      {
        user_id: user.id,
        amount: parseFloat(amount),
        schedule,
        next_payday: nextPayday,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    router.push("/dashboard");
  };

  if (loading || saving) return <Loading />;

  return (
    <>
      {error && <p className="mb-4 text-sm text-danger">{error}</p>}
      <form onSubmit={savePaycheck} autoComplete="off" className="panel">
        <Input
          htmlFor="paycheckAmount"
          id="paycheckAmount"
          type="number"
          name="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0"
          pattern="\d+(\.\d{1,2})?"
        >
          Take-home amount
        </Input>
        <OptionSelect
          htmlFor="schedule"
          name="schedule"
          id="schedule"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          options={PAY_SCHEDULES}
        >
          How often you&apos;re paid
        </OptionSelect>
        <Input
          htmlFor="nextPayday"
          id="nextPayday"
          type="date"
          name="nextPayday"
          value={nextPayday}
          onChange={(e) => setNextPayday(e.target.value)}
        >
          Next payday
        </Input>
        <Submit />
      </form>
    </>
  );
}
