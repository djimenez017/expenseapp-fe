import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import useForm from "../../components/lib/useForm";
import Session from "../../components/hoc/session";
import Navigation from "../../components/Navigation/navigationBar";
import Button from "../../components/button";
import { useEffect, useState } from "react";

const GET_SINGLE_EXPENSE = gql`
  query getSingleExpense($ID: ID) {
    expense(id: $ID) {
      name
      frequency
      id
      dateDue
      amount
    }
  }
`;

const UPDATE_EXPENSE = gql`
  mutation updateExpense(
    $ID: Int
    $name: String
    $amount: Int
    $frequency: Frequency
    $dateDue: DateTime
  ) {
    updateExpense(
      ID: $ID
      name: $name
      amount: $amount
      frequency: $frequency
      dateDue: $dateDue
    ) {
      name
      amount
      dateDue
      frequency
    }
  }
`;

export default function SingleExpense() {
  const router = useRouter();
  const expenseId = parseInt(router.query["id"]);
  const [uDate, setUDate] = useState("");
  const { data, error, loading } = useQuery(GET_SINGLE_EXPENSE, {
    variables: { ID: expenseId },
  });

  const [
    editExpense,
    { data: updatedData, error: updateError, loading: updateLoading },
  ] = useMutation(UPDATE_EXPENSE);

  const { inputs, handleChange, resetForm, clearForm } = useForm(data?.expense);

  if (loading) return <p>Loading...</p>;
  if (updateLoading) return <p>Updating</p>;
  if (updatedData) router.push("/dashboard");

  console.table(inputs);

  if (inputs.dateDue) {
    let formattedDate;
    const dateEntered = new Date(inputs.dateDue);
    formattedDate = dateEntered.toISOString().split("T")[0];
  }

  const dateHandler = (e) => {
    //console.log(e.target.value);
    const date = e.target.value;
    const dateEntered = new Date(date);
    setUDate(dateEntered.toISOString());
  };

  return (
    <Session>
      <div className="w-full">
        <Navigation />
        <main
          className="container box-border p-2 space-y-4"
          style={{ maxWidth: "750px" }}
        >
          <h2 className="text-4xl font-bold tracking-wide text-center">
            Edit Expense{" "}
          </h2>
          <form
            autoComplete="off"
            onSubmit={async (e) => {
              console.log(uDate);
              e.preventDefault();
              await editExpense({
                variables: {
                  ID: expenseId,
                  name: inputs.name,
                  amount: inputs.amount,
                  frequency: inputs.frequency,
                  dateDue: uDate,
                },
              });
            }}
          >
            <div className="my-5">
              <label htmlFor="ExpenseName">
                Expense Name
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={"p-2 w-full"}
                  value={inputs.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <br />
              <label htmlFor="Amount">
                Amount
                <input
                  id="amount"
                  className={"p-2 w-full"}
                  required
                  type="number"
                  name="amount"
                  value={inputs.amount}
                  onChange={handleChange}
                />
              </label>
              <label htmlFor="Frequency">
                Frequency
                <select
                  name="frequency"
                  id="frequency"
                  value={inputs.frequency}
                  onChange={handleChange}
                  className={"p-2 w-full"}
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </label>
              <label htmlFor="Date">
                Due Date
                <input
                  id="Date"
                  className={"p-2 w-full"}
                  type="date"
                  value={formattedDate}
                  onChange={dateHandler}
                />
              </label>
              <br />
              <br />

              <Button type="Submit">Update Expense</Button>
            </div>
          </form>
        </main>
      </div>
    </Session>
  );
}
