import formatDateExtension from "./formatDateExtension";

export const EXPENSE_KINDS = [
  { value: "BILL", label: "Bill" },
  { value: "SUBSCRIPTION", label: "Subscription" },
  { value: "LOAN", label: "Loan" },
  { value: "CREDIT_CARD", label: "Credit card" },
];

export function tracksBalance(kind) {
  return kind === "LOAN" || kind === "CREDIT_CARD";
}

export const RECOMMENDED_UTILIZATION = 0.3;

export function cardUtilization(balance, limit) {
  const cap = Number(limit);
  if (!cap || cap <= 0 || balance == null || balance === "") return null;
  const owed = Number(balance);
  if (Number.isNaN(owed)) return null;
  return owed / cap;
}

export function aboveRecommendedUse(rate) {
  return rate != null && Math.round(rate * 100) > RECOMMENDED_UTILIZATION * 100;
}

export function formatUtilization(rate) {
  return `${Math.round(rate * 100)}%`;
}

export function combinedUtilization(cards) {
  let balance = 0;
  let limit = 0;

  for (const card of cards) {
    const cap = Number(card.credit_limit);
    if (!cap || cap <= 0) continue;
    const owed =
      card.remaining_balance == null || card.remaining_balance === ""
        ? 0
        : Number(card.remaining_balance);
    if (Number.isNaN(owed)) continue;
    balance += owed;
    limit += cap;
  }

  if (limit <= 0) return null;
  return { balance, limit, rate: balance / limit };
}

export const EXPENSE_FREQUENCIES = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" },
];

export function filterByFrequency(expenses, frequency) {
  if (!frequency) return expenses;
  return expenses.filter((expense) => expense.frequency === frequency);
}

export const PAY_SCHEDULES = [
  { value: "WEEKLY", label: "Weekly" },
  { value: "BIWEEKLY", label: "Every 2 weeks" },
  { value: "SEMIMONTHLY", label: "Twice a month" },
  { value: "MONTHLY", label: "Monthly" },
];

export function dateFieldLabel(kind) {
  if (kind === "SUBSCRIPTION") return "Renewal date";
  if (tracksBalance(kind)) return "Next payment";
  return "Due date";
}

export function amountFieldLabel(kind) {
  if (tracksBalance(kind)) return "Payment amount";
  return "Amount";
}

export function scheduleLabel(schedule, paycheck) {
  if (
    schedule === "SEMIMONTHLY" &&
    paycheck?.payday_one &&
    paycheck?.payday_two
  ) {
    const [first, second] = [Number(paycheck.payday_one), Number(paycheck.payday_two)].sort(
      (a, b) => a - b
    );
    return `the ${formatDateExtension(first)} and the ${formatDateExtension(second)}`;
  }

  return PAY_SCHEDULES.find((item) => item.value === schedule)?.label || schedule;
}
