import React, { useState } from "react";
import { useRouter } from "next/router";
import Input from "../forms/formComponents/input";
import Submit from "../forms/formComponents/Submit";
import Loading from "../UI/Loading";
import { messages } from "../lib/limits";
import { supabase } from "../lib/supabase";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(messages.signInFailed);
      return;
    }

    router.push("/dashboard");
  };

  if (loading) return <Loading />;

  return (
    <div>
      {error && (
        <p className="text-orange font-bold mb-2">{error}</p>
      )}
      <form onSubmit={onSubmitHandler}>
        <div className="my-2">
          <Input
            htmlFor="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            required
            name="email"
          >
            Email
          </Input>
          <Input
            htmlFor="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
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
