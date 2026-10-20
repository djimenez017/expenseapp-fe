import { requireSupabase } from "./supabase";

const FREQUENCIES = ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"];

function normalize(row) {
  return {
    id: row.id,
    name: row.name,
    amount: Number(row.amount),
    frequency: row.frequency,
    dateDue: row.date_due,
  };
}

function expenseFields(input) {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const amount = Number(input.amount);
  const frequency = input.frequency;
  const dateDue = input.dateDue;

  if (!name) throw new Error("Enter an expense name.");
  if (!FREQUENCIES.includes(frequency)) throw new Error("Choose a frequency.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateDue || "")) {
    throw new Error("Choose a due date.");
  }
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("Enter an amount of 0 or more.");
  }

  return {
    name,
    amount,
    frequency,
    date_due: dateDue,
  };
}

async function currentUserId() {
  const { data, error } = await requireSupabase().auth.getUser();
  if (error || !data.user) throw new Error("Not signed in.");
  return data.user.id;
}

export async function fetchProfile() {
  const userId = await currentUserId();
  const client = requireSupabase();
  const { data, error } = await client
    .from("profiles")
    .select("full_name, username")
    .eq("id", userId)
    .single();
  if (error) throw new Error(error.message);

  const { count, error: countError } = await client
    .from("expenses")
    .select("id", { count: "exact", head: true });
  if (countError) throw new Error(countError.message);

  return {
    fullName: data.full_name,
    username: data.username,
    expenseCount: count ?? 0,
  };
}

export async function fetchExpenses() {
  const { data, error } = await requireSupabase()
    .from("expenses")
    .select("id, name, amount, frequency, date_due")
    .order("date_due", { ascending: true });
  if (error) throw new Error(error.message);
  return (data || []).map(normalize);
}

export async function fetchExpense(id) {
  const { data, error } = await requireSupabase()
    .from("expenses")
    .select("id, name, amount, frequency, date_due")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Expense not found.");
  return normalize(data);
}

export async function createExpense(input) {
  const userId = await currentUserId();
  const { error } = await requireSupabase()
    .from("expenses")
    .insert({ ...expenseFields(input), user_id: userId });
  if (error) throw new Error(error.message);
}

export async function updateExpense(id, input) {
  const { error } = await requireSupabase()
    .from("expenses")
    .update(expenseFields(input))
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteExpense(id) {
  const { error } = await requireSupabase()
    .from("expenses")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}
