import React, { useState } from "react";
import { TAG_NAME_MAX, normalizeTagName } from "../../lib/tags";

function knownTag(name, tags) {
  return tags.find((tag) => tag.name.toLowerCase() === name.toLowerCase());
}

export default function TagField({ id, value, suggestions, onChange }) {
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const selected = value || [];
  const known = suggestions || [];

  const commit = (rawNames) => {
    const next = [...selected];

    for (const raw of rawNames) {
      const name = normalizeTagName(raw);
      if (!name || name.length > TAG_NAME_MAX) continue;
      const match = knownTag(name, [...next, ...known]);
      const nextName = match?.name || name;
      if (knownTag(nextName, next)) continue;
      next.push(match?.id ? { id: match.id, name: match.name } : { name: nextName });
    }

    onChange(next);
    setDraft("");
    setOpen(false);
  };

  const remove = (name) => {
    onChange(selected.filter((tag) => tag.name.toLowerCase() !== name.toLowerCase()));
  };

  const query = normalizeTagName(draft).toLowerCase();
  const matches = known.filter((tag) => {
    if (knownTag(tag.name, selected)) return false;
    if (!query) return true;
    return tag.name.toLowerCase().includes(query);
  });
  const exact = query && known.some((tag) => tag.name.toLowerCase() === query);
  const showAdd = Boolean(query) && !exact;
  const showMenu = open && (matches.length > 0 || showAdd);

  return (
    <div
      className="mb-4"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <label htmlFor={id} className="block text-sm font-bold text-muted">
        Tags
      </label>
      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selected.map((tag) => (
            <span
              key={tag.name}
              className="inline-flex items-center gap-1 rounded-full border border-line bg-paper px-3 py-1 text-sm font-bold text-ink"
            >
              {tag.name}
              <button
                type="button"
                className="text-muted hover:text-ink"
                aria-label={`Remove ${tag.name}`}
                onClick={() => remove(tag.name)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <input
          id={id}
          value={draft}
          maxLength={TAG_NAME_MAX}
          autoComplete="off"
          placeholder="Add a tag"
          onChange={(e) => {
            const next = e.target.value;
            if (next.includes(",")) {
              commit(next.split(","));
              return;
            }
            setDraft(next);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              if (draft.trim()) commit([draft]);
            }
            if (e.key === "Backspace" && !draft && selected.length > 0) {
              e.preventDefault();
              remove(selected[selected.length - 1].name);
            }
          }}
          className="mt-1 w-full rounded-2xl border border-line bg-white px-4 py-3 text-base font-normal text-ink outline-none focus:border-green"
        />
        {showMenu && (
          <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-2xl border border-line bg-white">
            {matches.map((tag) => (
              <li key={tag.id}>
                <button
                  type="button"
                  className="block w-full px-4 py-2 text-left text-sm font-bold text-ink hover:bg-paper"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => commit([tag.name])}
                >
                  {tag.name}
                </button>
              </li>
            ))}
            {showAdd && (
              <li>
                <button
                  type="button"
                  className="block w-full px-4 py-2 text-left text-sm font-bold text-ink hover:bg-paper"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => commit([draft])}
                >
                  Add &quot;{normalizeTagName(draft)}&quot;
                </button>
              </li>
            )}
          </ul>
        )}
      </div>
      <p className="mt-1 text-xs text-muted">Enter adds a tag. An expense can have more than one.</p>
    </div>
  );
}
