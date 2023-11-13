import React, { useState } from "react";
import Submit from "../forms/formComponents/Submit";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Input from "../forms/formComponents/input";

const LOG_IN_MUTATION = gql`
  mutation LogInMutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`;

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const usernameHandler = (e) => {
    setUsername(e.target.value);
  };

  const passwordHandler = (e) => {
    setPassword(e.target.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    logInMutation({ variables: { username: username, password: password } });
    setPassword("");
    setUsername("");
  };

  const [logInMutation, { data, loading, error }] = useMutation(
    LOG_IN_MUTATION,
    {
      onCompleted({ login }) {
        if (logInMutation) {
          localStorage.setItem("token", login.token);
        }
      },
    }
  );

  if (loading) return "Submitting...";
  if (data) router.push("/dashboard");

  return (
    <div>
      {error && <p> {error.message}</p>}
      <form onSubmit={onSubmitHandler}>
        <div className="my-5">
          <Input
            htmlFor="username"
            id="username"
            onChange={usernameHandler}
            value={username}
            required
            name="username"
          >
            Username
          </Input>
          <Input
            htmlFor="password"
            name="password"
            onChange={passwordHandler}
            value={password}
            type="password"
          >
            Password
          </Input>

          <Submit />
        </div>
      </form>
    </div>
  );
}
