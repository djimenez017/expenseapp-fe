import React, { useState } from "react";
import { useRouter } from "next/router";
import Input from "../forms/formComponents/input";
import Submit from "../forms/formComponents/Submit";
import Loading from "../UI/Loading";
import { FULL_NAME_MAX, MIN_PASSWORD_LENGTH, USERNAME_MAX, messages } from "../lib/limits";
import { supabase } from "../lib/supabase";
import { accountFieldError } from "../validator";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    const fieldError = accountFieldError({ name, username, password });
    if (fieldError) {
      setError(fieldError);
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name.trim(),
            username: username.trim(),
          },
        },
      });

      setLoading(false);

      if (signUpError) {
        setError(messages.signUpFailed);
        return;
      }

      if (data.session) {
        router.push("/addExpense");
        return;
      }

      setNotice("Check your email to confirm the account, then log in.");
    } catch {
      setLoading(false);
      setError(messages.signUpFailed);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      {error && (
        <p className="text-orange font-bold mb-2">{error}</p>
      )}
      {notice && (
        <p className="text-green font-bold mb-2">{notice}</p>
      )}
      <form onSubmit={onSubmitHandler}>
        <div className="my-5">
          <Input
            htmlFor="name"
            id="name"
            name="name"
            onChange={(e) => setName(e.target.value)}
            type="text"
            value={name}
            maxLength={FULL_NAME_MAX}
            required
          >
            Full Name
          </Input>
          <Input
            htmlFor="email"
            id="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            value={username}
            maxLength={USERNAME_MAX}
            required
          >
            Username
          </Input>
          <Input
            htmlFor="password"
            id="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            value={password}
            minLength={MIN_PASSWORD_LENGTH}
            autoComplete="new-password"
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
