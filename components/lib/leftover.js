const PERIODS_PER_YEAR = {
  WEEKLY: 52,
  BIWEEKLY: 26,
  SEMIMONTHLY: 24,
  MONTHLY: 12,
};

function tracksBalance(kind) {
  return kind === "LOAN" || kind === "CREDIT_CARD";
}

export function countsTowardBills(expense) {
  if (tracksBalance(expense.kind)) {
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
  if (schedule === "MONTHLY") return addMonths(date, direction);
  return null;
}

function paydayDays(paycheck) {
  const first = Number(paycheck?.payday_one);
  const second = Number(paycheck?.payday_two);
  if (!first || !second || first < 1 || second < 1 || first > 31 || second > 31) return null;
  if (first === second) return null;
  return [first, second];
}

function dayInMonth(year, month, day) {
  const last = new Date(year, month + 1, 0).getDate();
  return startOfDay(new Date(year, month, Math.min(day, last)));
}

function semimonthlyDates(dayA, dayB, anchor) {
  const dates = [];
  for (let offset = -1; offset <= 2; offset += 1) {
    const cursor = new Date(anchor.getFullYear(), anchor.getMonth() + offset, 1);
    dates.push(dayInMonth(cursor.getFullYear(), cursor.getMonth(), dayA));
    dates.push(dayInMonth(cursor.getFullYear(), cursor.getMonth(), dayB));
  }
  return dates.sort((a, b) => compareDay(a, b));
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
  if (!paycheck?.schedule) return null;
  const today = startOfDay(now);

  if (paycheck.schedule === "SEMIMONTHLY") {
    const days = paydayDays(paycheck);
    if (!days) return null;
    return semimonthlyDates(days[0], days[1], today).find((date) => compareDay(date, today) >= 0) || null;
  }

  if (!paycheck.next_payday) return null;
  let payday = startOfDay(parseSpentOn(paycheck.next_payday));

  for (let i = 0; i < 500 && compareDay(payday, today) < 0; i += 1) {
    const next = stepPayday(payday, paycheck.schedule, 1);
    if (!next || compareDay(next, payday) <= 0) return null;
    payday = next;
  }

  if (compareDay(payday, today) < 0) return null;
  return payday;
}

function previousPayday(paycheck, upcoming) {
  if (paycheck.schedule === "SEMIMONTHLY") {
    const days = paydayDays(paycheck);
    if (!days) return null;
    const earlier = semimonthlyDates(days[0], days[1], upcoming).filter(
      (date) => compareDay(date, upcoming) < 0
    );
    return earlier.length ? earlier[earlier.length - 1] : null;
  }

  return stepPayday(upcoming, paycheck.schedule, -1);
}

export function payPeriod(paycheck, now = new Date()) {
  const end = upcomingPayday(paycheck, now);
  if (!end) return null;
  const previous = previousPayday(paycheck, end);
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

function nextPaydayAfter(paycheck, payday) {
  if (paycheck.schedule === "SEMIMONTHLY") {
    const days = paydayDays(paycheck);
    if (!days) return null;
    return (
      semimonthlyDates(days[0], days[1], payday).find((date) => compareDay(date, payday) > 0) ||
      null
    );
  }

  return stepPayday(payday, paycheck.schedule, 1);
}

function chargesForPeriod(expenses, period, balances) {
  const charges = [];

  (expenses || []).forEach((expense) => {
    const dates = dueDatesInPeriod(expense, period.start, period.end);
    dates.forEach((dueOn) => {
      let amount = Number(expense.amount || 0);
      if (balances.has(expense.id)) {
        amount = Math.min(amount, balances.get(expense.id));
        balances.set(expense.id, roundMoney(balances.get(expense.id) - amount));
      }
      amount = roundMoney(amount);
      if (amount <= 0) return;
      charges.push({
        key: `${expense.id}-${dueOn.getFullYear()}-${dueOn.getMonth()}-${dueOn.getDate()}`,
        name: expense.name,
        kind: expense.kind || "BILL",
        amount,
        dueOn,
      });
    });
  });

  charges.sort((a, b) => compareDay(a.dueOn, b.dueOn) || a.name.localeCompare(b.name));
  return charges;
}

function loanBalances(expenses) {
  const balances = new Map();
  (expenses || []).forEach((expense) => {
    if (
      tracksBalance(expense.kind) &&
      expense.remaining_balance != null &&
      expense.remaining_balance !== ""
    ) {
      balances.set(expense.id, Number(expense.remaining_balance));
    }
  });
  return balances;
}

export function chargesThisCheck(paycheck, expenses, now = new Date()) {
  const period = payPeriod(paycheck, now);
  if (!period) return [];
  return chargesForPeriod(expenses, period, loanBalances(expenses));
}

export function upcomingChecks(paycheck, expenses, count = 4, now = new Date()) {
  if (!paycheck || paycheck.amount == null || paycheck.amount === "") return [];

  let end = upcomingPayday(paycheck, now);
  if (!end) return [];

  const balances = loanBalances(expenses);
  const checks = [];

  for (let i = 0; i < count && end; i += 1) {
    const previous = previousPayday(paycheck, end);
    if (!previous) break;
    const period = { start: addDays(previous, 1), end };
    const charges = chargesForPeriod(expenses, period, balances);
    const due = roundMoney(charges.reduce((total, charge) => total + charge.amount, 0));
    checks.push({
      payday: end,
      period,
      charges,
      due,
      left: roundMoney(Number(paycheck.amount) - due),
      current: i === 0,
    });
    end = nextPaydayAfter(paycheck, end);
  }

  return checks;
}

function monthWithMostDays(period) {
  const counts = new Map();
  let cursor = period.start;

  while (compareDay(cursor, period.end) <= 0) {
    const key = cursor.getFullYear() * 12 + cursor.getMonth();
    counts.set(key, (counts.get(key) || 0) + 1);
    cursor = addDays(cursor, 1);
  }

  let bestKey = null;
  let bestCount = -1;
  counts.forEach((count, key) => {
    if (count > bestCount) {
      bestKey = key;
      bestCount = count;
    }
  });

  return { year: Math.floor(bestKey / 12), month: bestKey % 12 };
}

function closestPair(checks, today) {
  if (checks.length <= 2) return checks;

  const pastOrToday = checks.filter((check) => compareDay(check.payday, today) <= 0);
  const upcoming = checks.filter((check) => compareDay(check.payday, today) > 0);
  const picked = [];
  if (pastOrToday.length) picked.push(pastOrToday[pastOrToday.length - 1]);
  if (upcoming.length) picked.push(upcoming[0]);
  checks.forEach((check) => {
    if (picked.length >= 2) return;
    if (!picked.some((item) => compareDay(item.payday, check.payday) === 0)) picked.push(check);
  });

  return picked.sort((a, b) => compareDay(a.payday, b.payday));
}

export function checksThisMonth(paycheck, expenses, now = new Date()) {
  if (!paycheck || paycheck.amount == null || paycheck.amount === "") return [];

  const today = startOfDay(now);
  let payday = upcomingPayday(paycheck, now);
  if (!payday) return [];

  for (let i = 0; i < 6; i += 1) {
    const previous = previousPayday(paycheck, payday);
    if (!previous) break;
    payday = previous;
  }

  const periods = [];
  for (let i = 0; i < 12 && payday; i += 1) {
    const previous = previousPayday(paycheck, payday);
    if (!previous) break;
    const period = { start: addDays(previous, 1), end: payday };
    const home = monthWithMostDays(period);
    if (home.year === today.getFullYear() && home.month === today.getMonth()) {
      periods.push(period);
    }
    payday = nextPaydayAfter(paycheck, payday);
  }

  const balances = loanBalances(expenses);
  return closestPair(
    periods.map((period) => ({ payday: period.end, period })),
    today
  ).map(({ period }) => {
    const charges = chargesForPeriod(expenses, period, balances);
    const due = roundMoney(charges.reduce((total, charge) => total + charge.amount, 0));
    return {
      payday: period.end,
      period,
      charges,
      due,
      left: roundMoney(Number(paycheck.amount) - due),
      current: compareDay(period.start, today) <= 0 && compareDay(today, period.end) <= 0,
    };
  });
}

export function paycheckBreakdown({ paycheck, expenses, now = new Date() }) {
  const [current] = upcomingChecks(paycheck, expenses, 1, now);
  if (!current) return null;
  return {
    payday: current.payday,
    charges: current.charges,
    due: current.due,
    left: current.left,
  };
}

export function formatShortDate(value) {
  const date = value instanceof Date ? value : parseSpentOn(value);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
