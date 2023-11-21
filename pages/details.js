import NavigationBar from "../components/Navigation/navigationBar";
import Footer from "../components/Navigation/footer";
import Session from "../components/hoc/session";
import { gql, useQuery } from "@apollo/client";
import Loading from "../components/UI/Loading";
import UserInfo from "../components/dashboard/userInfo";
import Tile from "../components/UI/Tile";
import Button from "../components/button";
import YearlyTotal from "../components/UI/YearlyTotal";

const GET_USER_EXPENSES = gql`
  query expenses {
    expenses {
      id
      author {
        fullName
        id
        username
        emailAddress
      }
      name
      amount
      frequency
      dateDue
      expenseAuthor
    }
  }
`;

export default function Details() {
  const { loading, error, data } = useQuery(GET_USER_EXPENSES, {
    refetchQueries: [{ query: GET_USER_EXPENSES }],
  });

  if (loading) return <Loading />;
  if (!data) return { data };
  if (error) return `Submission error! ${error.message}`;

  const dailyAmount = data.expenses
    .filter((expense) => expense.frequency == "DAILY")
    .reduce((total, expense) => total + expense.amount, 0);

  const weeklyAmount = data.expenses
    .filter((expense) => expense.frequency == "WEEKLY")
    .reduce((total, expense) => total + expense.amount, 0);

  const monthlyAmount = data.expenses
    .filter((expense) => expense.frequency == "MONTHLY")
    .reduce((total, expense) => total + expense.amount, 0);

  const yearlyAmount = data.expenses
    .filter((expense) => expense.frequency == "YEARLY")
    .reduce((total, expense) => total + expense.amount, 0);

  return (
    <Session>
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
    </Session>
  );
}
