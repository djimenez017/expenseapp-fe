import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";

export const TAG_NAME_MAX = 40;

const EXPENSE_COLUMNS =
  "id, name, amount, frequency, date_due, kind, remaining_balance, credit_limit";
const SPENDING_COLUMNS = "id, name, amount, spent_on";

export const EXPENSE_FIELDS = `${EXPENSE_COLUMNS}, expense_tags(tags(id, name))`;
export const SPENDING_FIELDS = `${SPENDING_COLUMNS}, spending_tags(tags(id, name))`;

function isMissingTagSchema(error) {
  const message = `${error?.message || ""} ${error?.details || ""}`;
  return (
    error?.code === "PGRST200" ||
    error?.code === "PGRST205" ||
    /expense_tags|spending_tags|schema cache/i.test(message)
  );
}

function missingCreditLimit(error) {
  return /credit_limit/i.test(`${error?.message || ""} ${error?.details || ""}`);
}

function withoutCreditLimit(fields) {
  return fields.replace(", credit_limit", "");
}

async function selectWithTags(table, fields, plain, linkKey, orderColumn, ascending) {
  let tagged = await supabase.from(table).select(fields).order(orderColumn, { ascending });

  if (tagged.error && missingCreditLimit(tagged.error)) {
    tagged = await supabase
      .from(table)
      .select(withoutCreditLimit(fields))
      .order(orderColumn, { ascending });
  }

  if (!tagged.error) {
    return {
      data: (tagged.data || []).map((row) => attachTags(row, linkKey)),
      error: null,
    };
  }

  if (!isMissingTagSchema(tagged.error)) return { data: [], error: tagged.error };

  const fallback = await supabase
    .from(table)
    .select(withoutCreditLimit(plain))
    .order(orderColumn, { ascending });

  if (fallback.error) return { data: [], error: fallback.error };
  return { data: (fallback.data || []).map((row) => ({ ...row, tags: [] })), error: null };
}

export function loadExpenses() {
  return selectWithTags(
    "expenses",
    EXPENSE_FIELDS,
    EXPENSE_COLUMNS,
    "expense_tags",
    "date_due",
    true
  );
}

export function loadSpending() {
  return selectWithTags(
    "spending",
    SPENDING_FIELDS,
    SPENDING_COLUMNS,
    "spending_tags",
    "spent_on",
    false
  );
}

export async function loadExpense(id) {
  let tagged = await supabase.from("expenses").select(EXPENSE_FIELDS).eq("id", id).maybeSingle();

  if (tagged.error && missingCreditLimit(tagged.error)) {
    tagged = await supabase
      .from("expenses")
      .select(withoutCreditLimit(EXPENSE_FIELDS))
      .eq("id", id)
      .maybeSingle();
  }

  if (!tagged.error) {
    return { data: tagged.data ? attachTags(tagged.data, "expense_tags") : null, error: null };
  }

  if (!isMissingTagSchema(tagged.error)) return { data: null, error: tagged.error };

  const fallback = await supabase
    .from("expenses")
    .select(withoutCreditLimit(EXPENSE_COLUMNS))
    .eq("id", id)
    .maybeSingle();

  if (fallback.error) return { data: null, error: fallback.error };
  return { data: fallback.data ? { ...fallback.data, tags: [] } : null, error: null };
}

export function normalizeTagName(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

export function uniqueTagNames(names) {
  const seen = new Set();
  const result = [];

  for (const raw of names) {
    const name = normalizeTagName(raw);
    if (!name || name.length > TAG_NAME_MAX) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(name);
  }

  return result;
}

export function tagsFromLinks(links) {
  if (!Array.isArray(links)) return [];

  const tags = [];

  for (const link of links) {
    const related = link?.tags;
    const rows = Array.isArray(related) ? related : related ? [related] : [];
    for (const tag of rows) {
      if (tag?.id == null || !tag.name) continue;
      tags.push({ id: tag.id, name: tag.name });
    }
  }

  tags.sort((a, b) => a.name.localeCompare(b.name));
  return tags;
}

export function attachTags(row, linkKey) {
  if (!row) return row;
  const next = { ...row, tags: tagsFromLinks(row[linkKey]) };
  delete next[linkKey];
  return next;
}

export function collectTags(groups) {
  const byId = new Map();

  for (const group of groups) {
    for (const item of group || []) {
      for (const tag of item.tags || []) {
        byId.set(tag.id, tag);
      }
    }
  }

  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function hasTag(item, tagId) {
  return (item.tags || []).some((tag) => tag.id === tagId);
}

function pickTags(tags, wanted) {
  const byKey = new Map(tags.map((tag) => [tag.name.toLowerCase(), tag]));
  return wanted
    .map((name) => byKey.get(name.toLowerCase()))
    .filter((tag) => tag?.id != null);
}

async function ensureTags(userId, names) {
  const wanted = uniqueTagNames(names);
  if (wanted.length === 0) return { tags: [], error: null };

  const { data: existing, error } = await supabase
    .from("tags")
    .select("id, name")
    .eq("user_id", userId);

  if (error) return { tags: [], error };

  const byKey = new Map((existing || []).map((tag) => [tag.name.toLowerCase(), tag]));
  const missing = wanted.filter((name) => !byKey.has(name.toLowerCase()));

  if (missing.length > 0) {
    const { data: created, error: insertError } = await supabase
      .from("tags")
      .insert(missing.map((name) => ({ user_id: userId, name })))
      .select("id, name");

    if (insertError) {
      if (insertError.code !== "23505") return { tags: [], error: insertError };

      const { data: again, error: againError } = await supabase
        .from("tags")
        .select("id, name")
        .eq("user_id", userId);

      if (againError) return { tags: [], error: againError };
      return { tags: pickTags(again || [], wanted), error: null };
    }

    for (const tag of created || []) byKey.set(tag.name.toLowerCase(), tag);
  }

  return { tags: pickTags([...byKey.values()], wanted), error: null };
}

function numericIds(ids) {
  return ids.map((id) => Number(id)).filter((id) => Number.isInteger(id));
}

async function syncLinks(table, foreignKey, parentId, tagIds) {
  const ids = numericIds(tagIds);
  let remove = supabase.from(table).delete().eq(foreignKey, parentId);
  if (ids.length > 0) {
    remove = remove.not("tag_id", "in", `(${ids.join(",")})`);
  }

  const { error: deleteError } = await remove;
  if (deleteError) {
    if (ids.length === 0 && isMissingTagSchema(deleteError)) return null;
    return deleteError;
  }
  if (ids.length === 0) return null;

  const { data: current, error: readError } = await supabase
    .from(table)
    .select("tag_id")
    .eq(foreignKey, parentId);

  if (readError) return readError;

  const have = new Set((current || []).map((row) => Number(row.tag_id)));
  const rows = ids
    .filter((tagId) => !have.has(tagId))
    .map((tagId) => ({ [foreignKey]: parentId, tag_id: tagId }));

  if (rows.length === 0) return null;

  const { error: insertError } = await supabase.from(table).insert(rows);
  return insertError;
}

export async function syncExpenseTags(userId, expenseId, names) {
  const { tags, error } = await ensureTags(userId, names);
  if (error) return error;
  return syncLinks(
    "expense_tags",
    "expense_id",
    expenseId,
    tags.map((tag) => tag.id)
  );
}

export async function syncSpendingTags(userId, spendingId, names) {
  const { tags, error } = await ensureTags(userId, names);
  if (error) return error;
  return syncLinks(
    "spending_tags",
    "spending_id",
    spendingId,
    tags.map((tag) => tag.id)
  );
}

export function useTagSuggestions() {
  const [suggestions, setSuggestions] = useState([]);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase.from("tags").select("id, name").order("name");
    if (!error) setSuggestions(data || []);
    return error;
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { suggestions, refreshSuggestions: refresh };
}
