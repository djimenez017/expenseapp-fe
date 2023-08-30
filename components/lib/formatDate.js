export default function formatDate(frequency, dateDue) {
  function weeklyUpdate(numOfWeeks, date = new Date()) {
    date.setDate(date.getDate() + numOfWeeks * 7 + 1);
    return date;
  }

  function monthlyUpdate(numOfMonths, date = new Date()) {
    date.setMonth(date.getMonth() + numOfMonths);
    return date;
  }

  function yearlyUpdate(numOfYears, date = new Date()) {
    date.setFullYear(date.getFullYear() + numOfYears);
    return date;
  }

  switch (frequency) {
    case "WEEKLY":
      return weeklyUpdate(1, new Date(dateDue));
    case "MONTHLY":
      return monthlyUpdate(1, new Date(dateDue));
    case "YEARLY":
      return yearlyUpdate(1, new Date(dateDue));
    default:
      return dateDue;
  }
}
