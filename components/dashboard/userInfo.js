import React from "react";
import { gql, useQuery } from "@apollo/client";
import Session from "../hoc/session";

const GET_CURRENT_USER = gql`
  query currentUser {
    currentUser {
      username
      fullName
      id
      emailAddress
      expenses {
        name
        id
      }
    }
  }
`;

export default function UserInfo() {
  const { loading, data, error } = useQuery(GET_CURRENT_USER, {
    refetchQueries: [{ query: GET_CURRENT_USER }],
  });

  if (loading) return <p>Fetching User</p>;
  if (error) return <p>Error</p>;

  const { fullName } = data.currentUser;

  return (
    <Session>
      <div className="bg-white py-5">
        <h1 className="text-grey text-4xl font-bold">{fullName}</h1>
        <p className="py-2 font-bold text-lg">
          Total Expenses:{" "}
          <span className="text-orange text-2xl">
            {data.currentUser.expenses.length}
          </span>
        </p>
      </div>
    </Session>
  );
}
