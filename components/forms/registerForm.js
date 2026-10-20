import React, { useState } from "react";
import { useRouter } from "next/router";
import Input from "../forms/formComponents/input";
import Submit from "../forms/formComponents/Submit";
import Loading from "../UI/Loading";
import Button from "../button";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const router = useRouter();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
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
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      router.push("/addExpense");
      return;
    }

    setNeedsConfirmation(true);
  };

  if (loading) return <Loading />;

  if (needsConfirmation) {
    return (
      <div className="space-y-4">
        <p>
          Check your email to confirm your account. After you confirm, log in
          to add an expense.
        </p>
        <Button to="/">Back to login</Button>
      </div>
    );
  }

  return (
    <>
      {!isSupabaseConfigured && (
        <div className="text-red-700 bg-red-200 p-2 mb-2">
          <p>
            Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY,
            then run supabase/schema.sql in the Supabase SQL editor.
          </p>
        </div>
      )}
      {error && (
        <div className="text-red-700 bg-red-200 p-2 mb-2">
          <p>{error}</p>
        </div>
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
