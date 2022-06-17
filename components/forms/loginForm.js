import React, { useState } from "react";
import Button from "../button";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

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
  if (error) return `Submission error! ${error.message}`;

  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <div className="my-5">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            onChange={usernameHandler}
            className={"p-2 w-full"}
            value={username}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            name="password"
            onChange={passwordHandler}
            className={"p-2 w-full"}
            value={password}
            type="password"
          />
          <br /> <br />
          <Button type="Submit">Log In</Button>
        </div>
      </form>
    </div>
  );
}
