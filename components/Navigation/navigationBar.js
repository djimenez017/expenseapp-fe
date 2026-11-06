import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { supabase } from "../lib/supabase";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", desktopOnly: true },
  { href: "/graphs", label: "Graphs" },
  { href: "/details", label: "Details" },
  { href: "/profile", label: "Profile" },
];

export default function NavigationBar() {
  const router = useRouter();

  const signout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-2 px-3 sm:justify-between sm:gap-4 sm:px-6 lg:px-8">
        <Link href="/dashboard">
          <a className="shrink-0 text-lg font-semibold text-ink sm:text-xl">
            Expense<span className="text-clay">App</span>
          </a>
        </Link>
        <nav className="scroll-strip ml-auto flex min-w-0 items-center gap-0.5 overflow-x-auto text-[13px] font-bold sm:gap-2 sm:text-sm">
          {LINKS.map((link) => {
            const current = router.pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <a
                  aria-current={current ? "page" : undefined}
                  className={`shrink-0 whitespace-nowrap rounded-full px-2 py-2 sm:px-3 ${
                    link.desktopOnly ? "hidden sm:inline-flex" : "inline-flex"
                  } ${current ? "bg-white text-ink" : "text-muted hover:text-ink"}`}
                >
                  {link.label}
                </a>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={signout}
            className="shrink-0 whitespace-nowrap rounded-full px-2 py-2 font-bold text-muted hover:text-ink sm:px-3"
          >
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}
