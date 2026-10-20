export function parseDueDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(value.getTime());
  }

  if (typeof value === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (match) {
      return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    }
  }

  return new Date(value);
}

export default function formatDate(frequency, dateDue) {
  const due = parseDueDate(dateDue);

  function weeklyUpdate(numOfWeeks, date) {
    const next = new Date(date.getTime());
    next.setDate(next.getDate() + numOfWeeks * 7);
    return next;
  }

  function monthlyUpdate(numOfMonths, date) {
    const next = new Date(date.getTime());
    next.setMonth(next.getMonth() + numOfMonths);
    return next;
  }

  function yearlyUpdate(numOfYears, date) {
    const next = new Date(date.getTime());
    next.setFullYear(next.getFullYear() + numOfYears);
    return next;
  }

  switch (frequency) {
    case "WEEKLY":
      return weeklyUpdate(1, due);
    case "MONTHLY":
      return monthlyUpdate(1, due);
    case "YEARLY":
      return yearlyUpdate(1, due);
    default:
      return due;
  }
}
