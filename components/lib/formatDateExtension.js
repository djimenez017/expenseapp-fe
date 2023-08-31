export default function formatDateExtension(date) {
  // Convert the date to a string for easier manipulation
  const dateStr = date.toString();

  // Check for special cases first
  if (
    dateStr.endsWith("11") ||
    dateStr.endsWith("12") ||
    dateStr.endsWith("13")
  ) {
    return dateStr + "th";
  }

  // For all other cases, use a switch statement
  switch (dateStr.charAt(dateStr.length - 1)) {
    case "1":
      return dateStr + "st";
    case "2":
      return dateStr + "nd";
    case "3":
      return dateStr + "rd";
    default:
      return dateStr + "th";
  }
}
