import React, { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function DeleteAccount({ email }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  const removeAccount = async (event) => {
    event.preventDefault();
    setError("");

    if (confirmEmail.trim().toLowerCase() !== String(email || "").toLowerCase()) {
      setError("Type your email exactly to confirm.");
      return;
    }

    setWorking(true);
    const { error: deleteError } = await supabase.rpc("delete_own_account");

    if (deleteError) {
      setWorking(false);
      setError(
        deleteError.message.includes("delete_own_account")
          ? "Account deletion is not set up yet. Run the latest SQL migration, then try again."
          : deleteError.message
      );
      return;
    }

    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <section className="panel border-danger/40">
      <h2 className="text-2xl">Delete account</h2>
      <p className="mt-2 text-muted">
        This removes your login, paycheck, bills, subscriptions, loans, and spending.
        Nothing is kept, and it cannot be undone.
      </p>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-danger px-5 py-3 font-bold text-danger transition hover:bg-danger hover:text-white"
        >
          Delete account
        </button>
      ) : (
        <form onSubmit={removeAccount} className="mt-4" autoComplete="off">
          <label htmlFor="confirmEmail" className="mb-4 block text-sm font-bold text-muted">
            Type {email} to confirm
            <input
              id="confirmEmail"
              type="email"
              value={confirmEmail}
              onChange={(event) => setConfirmEmail(event.target.value)}
              placeholder={email}
              required
              className="mt-1 w-full rounded-2xl border border-line bg-white px-4 py-3 text-base font-normal text-ink outline-none focus:border-danger"
            />
          </label>
          {error && <p className="mb-3 text-sm text-danger">{error}</p>}
          <button
            type="submit"
            disabled={working}
            className="inline-flex w-full items-center justify-center rounded-full bg-danger px-5 py-3 font-bold text-white transition hover:bg-ink disabled:opacity-60"
          >
            {working ? "Deleting account…" : "Delete account forever"}
          </button>
        </form>
      )}
    </section>
  );
}
