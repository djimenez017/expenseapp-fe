import React, { useState } from "react";
import Button from "../button";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import Input from "../forms/formComponents/input";
import Submit from "../forms/formComponents/Submit";
import Loading from "../UI/Loading";

const REGISTER_MUTATION = gql`
  mutation RegisterMutation(
    $fullName: String!
    $emailAddress: String!
    $username: String!
    $password: String!
  ) {
    register(
      fullName: $fullName
      emailAddress: $emailAddress
      username: $username
      password: $password
    ) {
      fullName
      username
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

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const nameHandler = (e) => {
    setName(e.target.value);
  };

  const emailHandler = (e) => {
    setEmail(e.target.value);
  };

  const usernameHandler = (e) => {
    setUsername(e.target.value);
  };

  const passwordHandler = (e) => {
    setPassword(e.target.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    registerMutation({
      variables: {
        fullName: name,
        emailAddress: email,
        username: username,
        password: password,
      },
    });
    setName("");
    setEmail("");
    setUsername("");
    setPassword("");
  };

  const [registerMutation, { data, loading, error }] = useMutation(
    REGISTER_MUTATION,
    { refetchQueries: [{ query: GET_USER_EXPENSES }] }
  );

  if (loading) return <Loading
  if (data) router.push("/addExpense");
  if (error) return `Submission error! ${error.message}`;

  return (
    <>
      <form onSubmit={onSubmitHandler}>
        <div className="my-5">
          <Input
            htmlFor="name"
            id="name"
            name="name"
            onChange={nameHandler}
            type="text"
            value={name}
            required
          >
            Full Name
          </Input>
          <Input
            htmlFor="email"
            id="email"
            name="email"
            onChange={emailHandler}
            type="email"
            value={email}
            required
          >
            Email Address
          </Input>
          <Input
            htmlFor="username"
            id="username"
            name="username"
            onChange={usernameHandler}
            type="text"
            value={username}
            required
          >
            Username
          </Input>
          <Input
            htmlFor="password"
            id="password"
            name="password"
            onChange={passwordHandler}
            type="password"
            value={password}
            required
          >
            Password
          </Input>

          <Submit />
        </div>
      </form>
    </>
  );
}
