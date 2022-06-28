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
    }
  }
`;

export default function UserInfo() {
  const { loading, data, error } = useQuery(GET_CURRENT_USER);

  if (loading) return <p>Fetching User</p>;
  if (error) return <p>Error</p>;

  const { fullName, emailAddress, username } = data.currentUser;

  return (
    <Session>
      <div className="bg-white p-6">
        <h1 className="text-grey text-4xl font-bold">{fullName}</h1>
        <p className="text-grey text-2xl font-bold">{emailAddress} </p>
        <p className="text-grey text-xl">username:{username} </p>
      </div>
    </Session>
  );
}
