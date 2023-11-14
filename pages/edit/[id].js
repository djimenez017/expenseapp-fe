import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import useForm from "../../components/lib/useForm";
import Session from "../../components/hoc/session";
import Navigation from "../../components/Navigation/navigationBar";
import { useState } from "react";
import Title from "../../components/UI/Title";
import Input from "../../components/forms/formComponents/input";
import Select from "../../components/forms/formComponents/Select";
import Footer from "../../components/Navigation/footer";
import Submit from "../../components/forms/formComponents/Submit";
import Loading from "../../components/UI/Loading";

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
    $amount: Float
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

  if (loading) return <Loading />;
  if (updateLoading) return <p>Updating</p>;
  if (updatedData) router.push("/dashboard");

  if (inputs.dateDue) {
    let formattedDate;
    const dateEntered = new Date(inputs.dateDue);
    formattedDate = dateEntered.toISOString().split("T")[0];
  }

  const dateHandler = (e) => {
    const date = e.target.value;
    const dateEntered = new Date(date);
    setUDate(dateEntered.toISOString());
  };

  return (
    <Session>
      <Navigation />
      <main
        className="container box-border p-2 space-y-4 flex h-screen justify-center items-center flex-col"
        style={{ maxWidth: "750px" }}
      >
        <Title>Edit Expense </Title>
        <form
          autoComplete="off"
          onSubmit={async (e) => {
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
          <Input
            htmlFor="ExpenseName"
            id="name"
            name="name"
            type="text"
            value={inputs.name}
            onChange={handleChange}
            required
          >
            Expense Name
          </Input>
          <Input
            htmlFor="amount"
            id="amount"
            required
            type="number"
            name="amount"
            value={inputs.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            pattern="\d+(\.\d{1,2})?"
          >
            Amount
          </Input>
          <Select
            htmlFor="frequency"
            name="frequency"
            id="frequency"
            value={inputs.frequency}
            onChange={handleChange}
          >
            Frequency
          </Select>

          <Input
            htmlFor="date"
            id="date"
            type="date"
            value={formattedDate}
            onChange={dateHandler}
          >
            Due Date
          </Input>
          <Submit />
        </form>
      </main>
      <Footer />
    </Session>
  );
}
