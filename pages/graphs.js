import { useEffect, useState } from "react";
import NavigationBar from "../components/Navigation/navigationBar";
import Footer from "../components/Navigation/footer";
import Session from "../components/hoc/session";
import Loading from "../components/UI/Loading";
import Title from "../components/UI/Title";
import GraphsView from "../components/graphs/GraphsView";
import { supabase } from "../components/lib/supabase";
import { loadExpenses, loadSpending, loadTransfers } from "../components/lib/tags";

function GraphsBody() {
  const [expenses, setExpenses] = useState(null);
  const [paycheck, setPaycheck] = useState(null);
  const [spending, setSpending] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      const [expensesResult, paycheckResult, spendingResult, transfersResult] = await Promise.all([
        loadExpenses(),
        supabase
          .from("paychecks")
          .select("amount, schedule, next_payday, payday_one, payday_two")
          .maybeSingle(),
        loadSpending(),
        loadTransfers(),
      ]);

      if (!active) return;

      const queryError =
        expensesResult.error ||
        paycheckResult.error ||
        spendingResult.error ||
        transfersResult.error;

      if (queryError) {
        setError(queryError.message);
        setExpenses([]);
        return;
      }

      setExpenses(expensesResult.data || []);
      setPaycheck(paycheckResult.data);
      setSpending(spendingResult.data || []);
      setTransfers(transfersResult.data || []);
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="board space-y-5">
      <Title>Graphs</Title>
      {error && <p className="panel text-danger">Could not load graphs. {error}</p>}
      {!expenses && !error && <Loading />}
      {expenses && !error && (
        <GraphsView
          expenses={expenses}
          paycheck={paycheck}
          spending={spending}
          transfers={transfers}
        />
      )}
    </main>
  );
}

export default function Graphs() {
  return (
    <Session>
      <div className="w-full">
        <NavigationBar />
        <GraphsBody />
        <Footer />
      </div>
    </Session>
  );
}
