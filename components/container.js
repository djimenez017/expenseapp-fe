import { gql, useQuery } from "@apollo/client";
import UserInfo from "./dashboard/userInfo";
import TotalCard from "./dashboard/totalCard";
import ExpenseCard from "./expenses/expenseCard";
import Button from "./button";

const GET_USER_EXPENSES = gql`
  query Expenses {
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

export default function Container(props) {
  const { loading, error, data } = useQuery(GET_USER_EXPENSES);

  if (loading) return "Getting Data...";
  if (error) return `Submission error! ${error.message}`;

  const userData = data.expenses[0].author;
  const expensesData = data.expenses.map((expense) => {
    return (
      <ExpenseCard
        key={expense.id}
        name={expense.name}
        amount={expense.amount}
        frequency={expense.frequency}
        dateDue={expense.dateDue}
      ></ExpenseCard>
    );
  });

  return (
    <main
      className="container box-border p-2 space-y-4"
      style={{ maxWidth: "650px" }}
    >
      <UserInfo data={userData} />
      <div className="flex flex-col ">
        <TotalCard />
      </div>
      <div className=" w-300px space-y-10">{expensesData}</div>
      <Button>Add Expense</Button>
    </main>
  );
}

// flex s:bg-grey flex-column justify-center justify-items-center p-2 content-center space-x-4
// space-y-4 p-2 bg-white
