import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation/navigationBar";
import Footer from "../components/Navigation/footer";
import Session from "../components/hoc/session";
import Title from "../components/UI/Title";
import Loading from "../components/UI/Loading";
import PaycheckForm from "../components/forms/paycheckForm";
import DeleteAccount from "../components/profile/deleteAccount";
import { supabase } from "../components/lib/supabase";

export default function Profile() {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!active) return;

      if (userError || !user) {
        setError(userError?.message || "Not signed in");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;

      if (profileError) {
        setError(profileError.message);
        return;
      }

      setAccount({
        fullName: profile?.full_name || user.email,
        email: profile?.email || user.email,
      });
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <Session>
      <Navigation />
      <main className="board space-y-8">
        <Title>Profile</Title>
        {error && <p className="panel text-danger">{error}</p>}
        {!account && !error && <Loading />}
        {account && (
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              <section className="panel">
                <p className="text-sm font-bold uppercase tracking-widest text-muted">Account</p>
                <h2 className="mt-1 text-3xl">{account.fullName}</h2>
                <p className="mt-2 text-muted">{account.email}</p>
              </section>
              <DeleteAccount email={account.email} />
            </div>
            <section className="space-y-3">
              <h2 className="text-2xl">Paycheck</h2>
              <PaycheckForm redirectTo={null} />
            </section>
          </div>
        )}
      </main>
      <Footer />
    </Session>
  );
}
