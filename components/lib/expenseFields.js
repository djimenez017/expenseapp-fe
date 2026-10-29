import { AMOUNT_MAX, EXPENSE_NAME_MAX } from "./limits";

const FREQUENCIES = ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"];

export function parseExpense({ name, amount, frequency, date }) {
  const trimmedName = String(name ?? "").trim();
  if (trimmedName.length < 1 || trimmedName.length > EXPENSE_NAME_MAX) {
    return { error: "Enter an expense name up to 200 characters." };
  }

  const value = typeof amount === "number" ? amount : Number(amount);
  if (!Number.isFinite(value) || value <= 0 || value >= AMOUNT_MAX) {
    return { error: "Enter an amount greater than 0." };
  }

  const cents = value * 100;
  if (Math.abs(cents - Math.round(cents)) > 1e-6) {
    return { error: "Enter an amount with at most two decimal places." };
  }

  if (!FREQUENCIES.includes(frequency)) {
    return { error: "Choose a valid frequency." };
  }

  const dueDate = new Date(`${date}T00:00:00`);
  if (!date || Number.isNaN(dueDate.getTime())) {
    return { error: "Enter a valid due date." };
  }

  return {
    error: "",
    name: trimmedName,
    amount: Math.round(cents) / 100,
    frequency,
    dateDue: dueDate.toISOString(),
  };
}
