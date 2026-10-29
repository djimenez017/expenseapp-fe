import { useEffect, useState } from "react";
import NavigationBar from "../components/Navigation/navigationBar";
import Footer from "../components/Navigation/footer";
import Session from "../components/hoc/session";
import Loading from "../components/UI/Loading";
import UserInfo from "../components/dashboard/userInfo";
import Tile from "../components/UI/Tile";
import Button from "../components/button";
import YearlyTotal from "../components/UI/YearlyTotal";
import { getCurrentUser } from "../components/lib/currentUser";
import { messages } from "../components/lib/limits";
import { supabase } from "../components/lib/supabase";

function DetailsBody() {
  const [expenses, setExpenses] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      const user = await getCurrentUser();
      if (!active) return;

      if (!user) {
        setError(messages.loadExpensesFailed);
        setExpenses([]);
        return;
      }

      const { data, error: queryError } = await supabase
        .from("expenses")
        .select("id, amount, frequency")
        .eq("user_id", user.id);

      if (!active) return;

      if (queryError) {
        setError(messages.loadExpensesFailed);
        setExpenses([]);
        return;
      }

      setExpenses(data || []);
    })();

    return () => {
      active = false;
    };
  }, []);

  if (!expenses) return <Loading />;
  if (error) return messages.loadExpensesFailed;

  const sumByFrequency = (frequency) =>
    expenses
      .filter((expense) => expense.frequency === frequency)
      .reduce((total, expense) => total + expense.amount, 0);

  const dailyAmount = sumByFrequency("DAILY");
  const weeklyAmount = sumByFrequency("WEEKLY");
  const monthlyAmount = sumByFrequency("MONTHLY");
  const yearlyAmount = sumByFrequency("YEARLY");

  return (
      <div className="w-full ">
        <NavigationBar />

        <div
          className="container box-border p-2 space-y-4 mb-10"
          style={{ maxWidth: "750px" }}
        >
          <UserInfo />
          <Button to="/dashboard">Back to Dashboard</Button>
          <div className="flex md:justify-between flex-wrap space-around">
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
        </div>

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
