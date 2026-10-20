import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../UI/Loading";
import { supabase } from "../lib/supabase";

export default function Session(props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    if (!supabase) {
      router.replace("/");
      return undefined;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (!data.session) router.replace("/");
      else setReady(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!active) return;
        if (!session) router.replace("/");
        else setReady(true);
      }
    );

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [router]);

  if (!ready) return <Loading />;
  return <div>{props.children}</div>;
}
