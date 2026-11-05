import { useEffect, useState } from "react";
import NavigationBar from "../components/Navigation/navigationBar";
import Footer from "../components/Navigation/footer";
import Session from "../components/hoc/session";
import Loading from "../components/UI/Loading";
import Tile from "../components/UI/Tile";
import Title from "../components/UI/Title";
import BackLink from "../components/UI/BackLink";
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
        supabase
          .from("paychecks")
          .select("amount, schedule, next_payday, payday_one, payday_two")
          .maybeSingle(),
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

        <main className="board space-y-5">
          <div>
            <BackLink />
            <Title>Details</Title>
          </div>
          <section aria-labelledby="schedule-totals" className="overflow-hidden rounded-2xl border border-line bg-white">
            <h2 id="schedule-totals" className="px-4 py-3 text-lg font-semibold sm:px-5">
              Bills by schedule
            </h2>
            <dl className="grid grid-cols-2 gap-px border-t border-line bg-line lg:grid-cols-4">
              <Tile frequency="Daily" amount={dailyAmount} />
              <Tile frequency="Weekly" amount={weeklyAmount} />
              <Tile frequency="Monthly" amount={monthlyAmount} />
              <Tile frequency="Yearly" amount={yearlyAmount} />
            </dl>
            <YearlyTotal
              dailyAmount={dailyAmount}
              weeklyAmount={weeklyAmount}
              monthlyAmount={monthlyAmount}
              yearlyAmount={yearlyAmount}
            />
          </section>
          <div className="grid items-start gap-5 lg:grid-cols-2">
            <LeftoverSummary paycheck={paycheck} summary={summary} />
            {paycheck && (
              <div className="panel">
                <PaycheckCheck paycheck={paycheck} expenses={expenses} spending={spending} />
              </div>
            )}
          </div>
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
