import React, { useState } from "react";
import formatMoney from "../lib/formatMoney";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import formatDate from "../lib/formatDate";

const DELETE_EXPENSE = gql`
  mutation DeleteExpense($ID: Int) {
    deleteExpense(ID: $ID) {
      name
    }
  }
`;

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

export default function ExpenseCard(props) {
  const router = useRouter();
  const initials = props.name
    .split(" ")
    .map((word) => word[0])
    .join("");

  console.log(props.dateDue, props.frequency);
  // const date = new Date();
  // const thisDay = new Date(props.dateDue).getDate() + 1;
  // const thisYear = date.getFullYear();
  // const thisMonth = date.getMonth() + 2;
  // const dueDate = ` ${thisMonth}/${thisDay}/${thisYear}`;
  //console.log(props.dateDue)

  const nextPayment = formatDate(props.frequency, new Date(props.dateDue));
  // console.log(formatDate("WEEKLY", new Date("2022-07-24T00:00:00.000Z")))
  // console.log(new Date(props.dateDue).toISOString())
  // console.log("this is the next payment" + new Date(nextPayment))

  const deleteHandler = (e) => {
    e.preventDefault();
    deleteExpense({
      variables: {
        ID: parseInt(props.id),
      },
    });
  };

  const [deleteExpense, { data, loading, error }] = useMutation(
    DELETE_EXPENSE,
    { refetchQueries: [{ query: GET_USER_EXPENSES }] }
  );

  if (loading) return <p>Deleting Expense</p>;
  if (error) return `Deletion Error ${error.message}`;
  //(data);

  return (
    <div
      className="flex  bg-green shadow-lg md:flex-row flex-col"
      style={{ maxWidth: "750px" }}
    >
      <div className=" md:w-2/12 md:text-center md:flex items-center content-center justify-items-center bg-green rounded-l-lg hidden">
        <div className="w-full h-max ">
          <h3 className="text-3xl font-bold ">{initials}</h3>
        </div>
      </div>

      <div className="p-6 md:w-9/12 ">
        <div className="flex justify-between md:flex-row flex-col text-left ">
          <h3 className="text-3xl font-bold">{props.name}</h3>
          <p className="text-l font-bold">
            {formatMoney(props.amount)}/{props.frequency}
          </p>
        </div>
        <p>Due Date:{new Date(nextPayment).toISOString()}</p>
      </div>

      <div className="md:w-1/12 w-full md:flex-row self-center flex-row h-full">
        <Link href={`/edit/${props.id}`} passHref>
          <button className=" bg-gray md:w-full h-full py-2 md:py-4 w-1/2  md:rounded-tr-lg">
            Edit
          </button>
        </Link>
        <button
          className=" bg-orange md:w-full h-full py-2 md:py-4 text-white w-1/2 rounded-br-lg md:rounded-br-lg"
          onClick={deleteHandler}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
