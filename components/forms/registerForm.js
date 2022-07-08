import React, { useState } from "react";
import Button from "../button";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";

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

  const [registerMutation, { data, loading, error }] =
    useMutation(REGISTER_MUTATION);

  if (loading) return "Creating Profile";
  if (data) router.push("/addExpense");
  if (error) return `Submission error! ${error.message}`;

  return (
    <div>
      {" "}
      <form onSubmit={onSubmitHandler}>
        <div className="my-5">
          <label htmlFor="name">
            Full Name
            <input
              id="name"
              className={"p-2 w-full"}
              onChange={nameHandler}
              type="text"
              value={name}
              required
            />
          </label>
          <br />
          <label htmlFor="name">
            Email Address
            <input
              id="email"
              className={"p-2 w-full"}
              onChange={emailHandler}
              type="email"
              value={email}
              required
            />
          </label>
          <br />
          <label htmlFor="username">
            Username
            <input
              id="name"
              className={"p-2 w-full"}
              onChange={usernameHandler}
              type="text"
              value={username}
              required
            />
          </label>
          <br />
          <label htmlFor="password">
            Password
            <input
              id="password"
              name="password"
              className={"p-2 w-full"}
              onChange={passwordHandler}
              type="password"
              value={password}
              required
            />
          </label>
          <br />
          <br /> <br />
          <Button type="Submit">Sign Up</Button>
        </div>
      </form>
    </div>
  );
}
