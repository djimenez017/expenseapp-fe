import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Input from "./formComponents/input";
import OptionSelect from "./formComponents/OptionSelect";
import Submit from "./formComponents/Submit";
import Loading from "../UI/Loading";
import { supabase } from "../lib/supabase";
import ensureProfile from "../lib/ensureProfile";
import { PAY_SCHEDULES } from "../lib/expenseOptions";

export default function PaycheckForm({ redirectTo = "/dashboard" }) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [schedule, setSchedule] = useState("BIWEEKLY");
  const [nextPayday, setNextPayday] = useState("");
  const [paydayOne, setPaydayOne] = useState("");
  const [paydayTwo, setPaydayTwo] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      const { data, error: queryError } = await supabase
        .from("paychecks")
        .select("amount, schedule, next_payday, payday_one, payday_two")
        .maybeSingle();

      if (!active) return;

      if (queryError) setError(queryError.message);
      if (data) {
        setAmount(data.amount);
        setSchedule(data.schedule);
        setNextPayday(data.next_payday ? String(data.next_payday).slice(0, 10) : "");
        setPaydayOne(data.payday_one ? String(data.payday_one) : "");
        setPaydayTwo(data.payday_two ? String(data.payday_two) : "");
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
    setSaved(false);
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

    const twiceAMonth = schedule === "SEMIMONTHLY";
    const firstDay = parseInt(paydayOne, 10);
    const secondDay = parseInt(paydayTwo, 10);
    if (
      twiceAMonth &&
      (firstDay === secondDay ||
        firstDay < 1 ||
        secondDay < 1 ||
        firstDay > 31 ||
        secondDay > 31)
    ) {
      setSaving(false);
      setError("Enter two different paydays between 1 and 31.");
      return;
    }

    const { error: saveError } = await supabase.from("paychecks").upsert(
      {
        user_id: user.id,
        amount: parseFloat(amount),
        schedule,
        next_payday: twiceAMonth ? null : nextPayday,
        payday_one: twiceAMonth ? firstDay : null,
        payday_two: twiceAMonth ? secondDay : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    if (redirectTo) {
      router.push(redirectTo);
      return;
    }

    setSaved(true);
  };

  if (loading || saving) return <Loading />;

  return (
    <>
      {error && <p className="mb-4 text-sm text-danger">{error}</p>}
      {saved && <p className="mb-4 text-sm font-bold text-green">Paycheck saved.</p>}
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
          max="9999999999.99"
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
        {schedule === "SEMIMONTHLY" ? (
          <div className="grid gap-x-4 sm:grid-cols-2">
            <Input
              htmlFor="paydayOne"
              id="paydayOne"
              type="number"
              name="paydayOne"
              value={paydayOne}
              min="1"
              max="31"
              step="1"
              onChange={(e) => setPaydayOne(e.target.value)}
              placeholder="5"
            >
              First payday, day of the month
            </Input>
            <Input
              htmlFor="paydayTwo"
              id="paydayTwo"
              type="number"
              name="paydayTwo"
              value={paydayTwo}
              min="1"
              max="31"
              step="1"
              onChange={(e) => setPaydayTwo(e.target.value)}
              placeholder="20"
            >
              Second payday, day of the month
            </Input>
          </div>
        ) : (
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
        )}
        <Submit>Save paycheck</Submit>
      </form>
    </>
  );
}
