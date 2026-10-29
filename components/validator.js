import {
  FULL_NAME_MAX,
  MIN_PASSWORD_LENGTH,
  USERNAME_MAX,
} from "./lib/limits";

export function passwordError(password) {
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    return "Password must be at least 8 characters.";
  }
  return "";
}

export function accountFieldError({ name, username, password }) {
  const fullName = String(name ?? "").trim();
  if (fullName.length < 1 || fullName.length > FULL_NAME_MAX) {
    return "Enter a full name up to 120 characters.";
  }

  const handle = String(username ?? "").trim();
  if (handle.length < 1 || handle.length > USERNAME_MAX) {
    return "Enter a username up to 40 characters.";
  }

  return passwordError(password);
}
