import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import useForm from "../../components/lib/useForm";
import Session from "../../components/hoc/session";
import Navigation from "../../components/Navigation/navigationBar";
import Button from "../../components/button";
import { useEffect } from "react";

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

  const { data, error, loading } = useQuery(GET_SINGLE_EXPENSE, {
    variables: { ID: expenseId },
  });

  const [
    editExpense,
    { data: updatedData, error: updateError, loading: updateLoading },
  ] = useMutation(UPDATE_EXPENSE);
  console.log(updateError);

  const { inputs, handleChange, resetForm, clearForm } = useForm(data?.expense);

  if (loading) return <p>Loading...</p>;

  const handleSubmit = (e) => {
    e.preventDefault();
    editExpense({
      ID: expenseId,
      name: inputs.name,
      amount: inputs.amount,
      frequency: inputs.frequency,
      dateDue: inputs.dateDue,
    });
  };
  console.log(inputs.dateDue);
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
          <form autoComplete="off" onSubmit={handleSubmit}>
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
                  value={inputs.dateDue}
                  onChange={handleChange}
                />
              </label>
              <br />
              <br />

              <Button type="Submit">Done</Button>
            </div>
          </form>
        </main>
      </div>
    </Session>
  );
}
