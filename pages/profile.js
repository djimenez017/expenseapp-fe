import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation/navigationBar";
import Footer from "../components/Navigation/footer";
import Session from "../components/hoc/session";
import Title from "../components/UI/Title";
import Loading from "../components/UI/Loading";
import BackLink from "../components/UI/BackLink";
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
      <main className="board space-y-5">
        <div>
          <BackLink />
          <Title>Profile</Title>
        </div>
        {error && <p className="panel text-danger">{error}</p>}
        {!account && !error && <Loading />}
        {account && (
          <div className="grid items-start gap-5 lg:grid-cols-2">
            <section className="panel" aria-label="Account">
              <h2 className="text-xl font-semibold">{account.fullName}</h2>
              <p className="mt-1 break-all text-muted">{account.email}</p>
            </section>
            <section className="space-y-3 lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <h2 className="text-lg font-semibold">Paycheck</h2>
              <PaycheckForm redirectTo={null} />
            </section>
            <DeleteAccount email={account.email} />
          </div>
        )}
      </main>
      <Footer />
    </Session>
  );
}
