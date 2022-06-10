import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import UserInfo from "./dashboard/userInfo";
import TotalCard from "./dashboard/totalCard";
import ExpenseCard from "./expenses/expenseCard";
import Button from "./button";
import Modal from "./dashboard/modal";

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

export default function Container(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [edit, setEdit] = useState();
  const [remove, setRemove] = useState();

  const { loading, error, data } = useQuery(GET_USER_EXPENSES);

  if (loading) return "Getting Data...";
  if (error) return `Submission error! ${error.message}`;

  const userData = data.expenses[0].author;
  const expensesData = data.expenses.map((expense) => {
    return (
      <ExpenseCard
        setEdit={(edit) => setEdit(edit)}
        setRemove={(remove) => setRemove(remove)}
        click={modalHandler}
        key={expense.id}
        name={expense.name}
        amount={expense.amount}
        frequency={expense.frequency}
        dateDue={expense.dateDue}
        id={expense.id}
      ></ExpenseCard>
    );
  });

  // console.log(edit, remove);

  // const modalHandler = () => {
  //   setIsOpen(!isOpen);
  //   console.log(isOpen);
  // };

  // const editHandler = () => {
  //   console.log(edit);
  // };
  // const removeHandler = () => {
  //   return remove;
  // };

  return (
    <main
      className="container box-border p-2 space-y-4"
      style={{ maxWidth: "750px" }}
    >
      <Modal open={isOpen}>Hello There</Modal>
      <button
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        data-modal-toggle="defaultModal"
      ></button>
      <UserInfo data={userData} />
      <div className="flex flex-col">
        <TotalCard />
      </div>
      <div className="w-300px space-y-10">{expensesData}</div>
      <Button>Add Expense</Button>
    </main>
  );
}

// flex s:bg-grey flex-column justify-center justify-items-center p-2 content-center space-x-4
// space-y-4 p-2 bg-white
