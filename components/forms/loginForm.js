import React, { useState } from "react";
import Submit from "../forms/formComponents/Submit";
import { useRouter } from "next/router";
import Input from "../forms/formComponents/input";
import Loading from "../UI/Loading";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      setPassword("");
      return;
    }

    router.push("/dashboard");
  };

  if (loading) return <Loading />;

  return (
    <div>
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
        <div className="my-2">
          <Input
            htmlFor="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            name="email"
            type="email"
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
