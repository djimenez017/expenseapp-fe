import { useEffect, useState } from "react";
import NavigationBar from "../components/Navigation/navigationBar";
import Footer from "../components/Navigation/footer";
import Session from "../components/hoc/session";
import Loading from "../components/UI/Loading";
import UserInfo from "../components/dashboard/userInfo";
import Tile from "../components/UI/Tile";
import Link from "next/link";
import YearlyTotal from "../components/UI/YearlyTotal";
import LeftoverSummary from "../components/UI/LeftoverSummary";
import { PaycheckCheck } from "../components/dashboard/paycheckSummary";
import { supabase } from "../components/lib/supabase";
import { leftoverSummary, sumByFrequency } from "../components/lib/leftover";

function DetailsBody() {
  const [expenses, setExpenses] = useState(null);
  const [paycheck, setPaycheck] = useState(null);
  const [spending, setSpending] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      const [expensesResult, paycheckResult, spendingResult] = await Promise.all([
        supabase
          .from("expenses")
          .select("id, name, amount, frequency, date_due, kind, remaining_balance"),
        supabase.from("paychecks").select("amount, schedule, next_payday").maybeSingle(),
        supabase.from("spending").select("id, amount, spent_on"),
      ]);

      if (!active) return;

      const queryError =
        expensesResult.error || paycheckResult.error || spendingResult.error;

      if (queryError) {
        setError(queryError.message);
        setExpenses([]);
        return;
      }

      setExpenses(expensesResult.data || []);
      setPaycheck(paycheckResult.data);
      setSpending(spendingResult.data || []);
    })();

    return () => {
      active = false;
    };
  }, []);

  if (!expenses) return <Loading />;
  if (error) return `Could not load expenses. ${error}`;

  const dailyAmount = sumByFrequency(expenses, "DAILY");
  const weeklyAmount = sumByFrequency(expenses, "WEEKLY");
  const monthlyAmount = sumByFrequency(expenses, "MONTHLY");
  const yearlyAmount = sumByFrequency(expenses, "YEARLY");
  const summary = leftoverSummary({ paycheck, expenses, spending });

  return (
      <div className="w-full ">
        <NavigationBar />

        <main className="shell space-y-6">
          <UserInfo />
          <Link href="/dashboard">
            <a className="text-sm font-bold text-green hover:text-ink">Back to dashboard</a>
          </Link>
          {paycheck && (
            <div className="panel">
              <PaycheckCheck paycheck={paycheck} expenses={expenses} />
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <Tile frequency="Daily" amount={dailyAmount.toFixed(2)} />
            <Tile frequency="Weekly" amount={weeklyAmount.toFixed(2)} />
            <Tile frequency="Monthly" amount={monthlyAmount.toFixed(2)} />
            <Tile frequency="Yearly" amount={yearlyAmount.toFixed(2)} />
          </div>
          <YearlyTotal
            dailyAmount={dailyAmount}
            weeklyAmount={weeklyAmount}
            monthlyAmount={monthlyAmount}
            yearlyAmount={yearlyAmount}
          />
          <LeftoverSummary paycheck={paycheck} summary={summary} />
        </main>

        <Footer />
      </div>
  );
}

export default function Details() {
  return (
    <Session>
      <DetailsBody />
    </Session>
  );
}
