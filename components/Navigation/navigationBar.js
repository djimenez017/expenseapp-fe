import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function NavigationBar() {
  const router = useRouter();

  const signout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/dashboard">
          <a className="text-2xl text-ink">
            Expense<span className="text-clay">App</span>
          </a>
        </Link>
        <button
          onClick={signout}
          className="text-sm font-bold text-muted hover:text-ink"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
