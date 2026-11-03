import { supabase } from "./supabase";

function fallbackUsername(user) {
  const base =
    (user.email?.split("@")[0] || "user")
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 24) || "user";

  return base;
}

export default async function ensureProfile(user) {
  const { data: profile, error: readError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (readError) return readError;
  if (profile) return null;

  const row = {
    id: user.id,
    full_name: user.user_metadata?.full_name || "",
    email: user.email,
  };

  let { error: insertError } = await supabase.from("profiles").insert(row);

  if (insertError && /username/i.test(insertError.message)) {
    row.username = fallbackUsername(user);
    ({ error: insertError } = await supabase.from("profiles").insert(row));

    if (insertError && /duplicate|unique/i.test(insertError.message)) {
      row.username = `${row.username}-${user.id.slice(0, 8)}`;
      ({ error: insertError } = await supabase.from("profiles").insert(row));
    }
  }

  return insertError;
}
