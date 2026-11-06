import React, { useState } from "react";
import { useRouter } from "next/router";
import Input from "../forms/formComponents/input";
import Submit from "../forms/formComponents/Submit";
import Loading from "../UI/Loading";
import { supabase } from "../lib/supabase";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
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

      setNotice("Check your email to confirm the account, then log in.");
    } catch (signUpFailure) {
      setLoading(false);
      setError(signUpFailure.message || "Could not create the account.");
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
      <form onSubmit={onSubmitHandler} className="panel">
        <div className="my-5">
          <Input
            htmlFor="name"
            id="name"
            name="name"
            onChange={(e) => setName(e.target.value)}
            type="text"
            value={name}
            maxLength={80}
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

          <Submit>Create account</Submit>
        </div>
      </form>
    </>
  );
}
