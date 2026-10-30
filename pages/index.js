import Head from "next/head";
import LoginForm from "../components/forms/loginForm";
import Button from "../components/button";
import Image from "next/image";
import PiggyBank from "../public/assets/Savings-bro.svg";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>Expense Tracker</title>
        <meta name="description" content="See what a paycheck can cover." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto grid min-h-screen max-w-5xl items-center gap-10 px-6 py-12 md:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-clay">ExpenseApp</p>
          <h1 className="mt-3 text-5xl text-ink md:text-6xl">
            See what a paycheck can cover.
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted">
            Bills, subscriptions, and loans come out of the next check. Daily
            purchases stay in the month.
          </p>
          <div className="mt-8">
            <Image
              src={PiggyBank}
              alt="A hand dropping a coin into a piggy bank"
              width={220}
              height={220}
            />
          </div>
        </div>
        <div className="panel">
          <h2 className="mb-4 text-3xl">Sign in</h2>
          <LoginForm />
          <p className="my-4 text-center text-sm text-muted">New here?</p>
          <Button to="/signup" variant="quiet">
            Create an account
          </Button>
        </div>
      </main>
    </div>
  );
}
