import NavigationBar from "../components/Navigation/navigationBar";
import Footer from "../components/Navigation/footer";
import Session from "../components/hoc/session";
import { useEffect, useState } from "react";
import Loading from "../components/UI/Loading";
import UserInfo from "../components/dashboard/userInfo";
import Tile from "../components/UI/Tile";
import Button from "../components/button";
import YearlyTotal from "../components/UI/YearlyTotal";
import { fetchExpenses } from "../components/lib/expenses";

function sumFrequency(expenses, frequency) {
  return expenses
    .filter((expense) => expense.frequency === frequency)
    .reduce((total, expense) => total + expense.amount, 0);
}

function DetailsBody() {
  const [expenses, setExpenses] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchExpenses()
      .then((rows) => {
        if (active) setExpenses(rows);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, []);

  if (error) return <p className="text-red-700 bg-red-200 p-2">{error}</p>;
  if (!expenses) return <Loading />;

  const dailyAmount = sumFrequency(expenses, "DAILY");
  const weeklyAmount = sumFrequency(expenses, "WEEKLY");
  const monthlyAmount = sumFrequency(expenses, "MONTHLY");
  const yearlyAmount = sumFrequency(expenses, "YEARLY");

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
