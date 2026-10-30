const PERIODS_PER_YEAR = {
  WEEKLY: 52,
  BIWEEKLY: 26,
  SEMIMONTHLY: 24,
  MONTHLY: 12,
};

export function countsTowardBills(expense) {
  if (expense.kind === "LOAN") {
    if (expense.remaining_balance == null || expense.remaining_balance === "") {
      return true;
    }
    return Number(expense.remaining_balance) > 0;
  }
  return true;
}

export function sumByFrequency(expenses, frequency) {
  return (expenses || [])
    .filter(countsTowardBills)
    .filter((expense) => expense.frequency === frequency)
    .reduce((total, expense) => total + Number(expense.amount || 0), 0);
}

export function yearlyBills(expenses) {
  return (
    sumByFrequency(expenses, "DAILY") * 365 +
    sumByFrequency(expenses, "WEEKLY") * 52 +
    sumByFrequency(expenses, "MONTHLY") * 12 +
    sumByFrequency(expenses, "YEARLY")
  );
}

export function monthlyBills(expenses) {
  return yearlyBills(expenses) / 12;
}

export function yearlyIncome(paycheck) {
  if (!paycheck || paycheck.amount == null || paycheck.amount === "") return null;
  const periods = PERIODS_PER_YEAR[paycheck.schedule];
  if (!periods) return null;
  return Number(paycheck.amount) * periods;
}

export function monthlyIncome(paycheck) {
  const yearly = yearlyIncome(paycheck);
  if (yearly == null) return null;
  return yearly / 12;
}

export function parseSpentOn(value) {
  const [year, month, day] = String(value).slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return startOfDay(next);
}

function addMonths(date, months) {
  const day = date.getDate();
  const next = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const last = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(day, last));
  return startOfDay(next);
}

function compareDay(a, b) {
  return startOfDay(a).getTime() - startOfDay(b).getTime();
}

function stepPayday(date, schedule, direction) {
  if (schedule === "WEEKLY") return addDays(date, direction * 7);
  if (schedule === "BIWEEKLY") return addDays(date, direction * 14);
  if (schedule === "SEMIMONTHLY") return addDays(date, direction * 15);
  if (schedule === "MONTHLY") return addMonths(date, direction);
  return null;
}

function stepDueDate(date, frequency, direction) {
  if (frequency === "WEEKLY") return addDays(date, direction * 7);
  if (frequency === "MONTHLY") return addMonths(date, direction);
  if (frequency === "YEARLY") {
    const next = new Date(date);
    next.setFullYear(next.getFullYear() + direction);
    return startOfDay(next);
  }
  return null;
}

export function upcomingPayday(paycheck, now = new Date()) {
  if (!paycheck?.next_payday || !paycheck.schedule) return null;
  const today = startOfDay(now);
  let payday = startOfDay(parseSpentOn(paycheck.next_payday));

  for (let i = 0; i < 500 && compareDay(payday, today) < 0; i += 1) {
    const next = stepPayday(payday, paycheck.schedule, 1);
    if (!next || compareDay(next, payday) <= 0) return null;
    payday = next;
  }

  if (compareDay(payday, today) < 0) return null;
  return payday;
}

export function payPeriod(paycheck, now = new Date()) {
  const end = upcomingPayday(paycheck, now);
  if (!end) return null;
  const previous = stepPayday(end, paycheck.schedule, -1);
  if (!previous) return null;
  return { start: addDays(previous, 1), end };
}

function dueDatesInPeriod(expense, start, end) {
  if (!expense?.date_due || expense.frequency === "DAILY") return [];
  if (!countsTowardBills(expense)) return [];

  let cursor = startOfDay(parseSpentOn(expense.date_due));

  for (let i = 0; i < 2000 && compareDay(cursor, end) > 0; i += 1) {
    const previous = stepDueDate(cursor, expense.frequency, -1);
    if (!previous || compareDay(previous, cursor) >= 0) return [];
    cursor = previous;
  }

  for (let i = 0; i < 2000 && compareDay(cursor, start) < 0; i += 1) {
    const next = stepDueDate(cursor, expense.frequency, 1);
    if (!next || compareDay(next, cursor) <= 0) return [];
    cursor = next;
  }

  const dates = [];
  for (let i = 0; i < 2000 && compareDay(cursor, end) <= 0; i += 1) {
    if (compareDay(cursor, start) >= 0) dates.push(cursor);
    const next = stepDueDate(cursor, expense.frequency, 1);
    if (!next || compareDay(next, cursor) <= 0) break;
    cursor = next;
  }

  return dates;
}

function roundMoney(value) {
  return Math.round(Number(value) * 100) / 100;
}

export function chargesThisCheck(paycheck, expenses, now = new Date()) {
  const period = payPeriod(paycheck, now);
  if (!period) return [];

  const charges = [];

  (expenses || []).forEach((expense) => {
    const dates = dueDatesInPeriod(expense, period.start, period.end);
    let remaining =
      expense.kind === "LOAN" &&
      expense.remaining_balance != null &&
      expense.remaining_balance !== ""
        ? Number(expense.remaining_balance)
        : null;

    dates.forEach((dueOn) => {
      let amount = Number(expense.amount || 0);
      if (remaining != null) {
        amount = Math.min(amount, remaining);
        remaining = roundMoney(remaining - amount);
      }
      amount = roundMoney(amount);
      if (amount <= 0) return;
      charges.push({
        key: `${expense.id}-${dueOn.getFullYear()}-${dueOn.getMonth()}-${dueOn.getDate()}`,
        name: expense.name,
        amount,
        dueOn,
      });
    });
  });

  charges.sort((a, b) => compareDay(a.dueOn, b.dueOn) || a.name.localeCompare(b.name));
  return charges;
}

export function paycheckBreakdown({ paycheck, expenses, now = new Date() }) {
  const payday = upcomingPayday(paycheck, now);
  if (!payday || paycheck.amount == null || paycheck.amount === "") return null;
  const charges = chargesThisCheck(paycheck, expenses, now);
  const due = roundMoney(charges.reduce((total, charge) => total + charge.amount, 0));
  return {
    payday,
    charges,
    due,
    left: roundMoney(Number(paycheck.amount) - due),
  };
}

export function formatLongDate(value) {
  const date = value instanceof Date ? value : parseSpentOn(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function spendingTotal(rows, predicate) {
  return (rows || [])
    .filter((row) => predicate(parseSpentOn(row.spent_on)))
    .reduce((total, row) => total + Number(row.amount || 0), 0);
}

export function isInMonth(value, now = new Date()) {
  const date = parseSpentOn(value);
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

export function spendingThisMonth(rows, now = new Date()) {
  return spendingTotal(
    rows,
    (date) =>
      date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
  );
}

export function spendingThisYear(rows, now = new Date()) {
  return spendingTotal(rows, (date) => date.getFullYear() === now.getFullYear());
}

export function leftoverSummary({ paycheck, expenses, spending, now = new Date() }) {
  const incomeYear = yearlyIncome(paycheck);
  const incomeMonth = monthlyIncome(paycheck);
  const billsYear = yearlyBills(expenses);
  const billsMonth = monthlyBills(expenses);
  const spendMonth = spendingThisMonth(spending, now);
  const spendYear = spendingThisYear(spending, now);

  return {
    incomeMonth,
    incomeYear,
    billsMonth,
    billsYear,
    spendMonth,
    spendYear,
    leftoverMonth: incomeMonth == null ? null : incomeMonth - billsMonth - spendMonth,
    leftoverYear: incomeYear == null ? null : incomeYear - billsYear - spendYear,
  };
}

export function formatDollars(value) {
  return `$${Number(value).toFixed(2)}`;
}
