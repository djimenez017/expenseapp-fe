import React from "react";

export default function TagChips({ tags, onSelect }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag.id || tag.name}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onSelect) onSelect(tag);
          }}
          className="rounded-full border border-line bg-paper px-2.5 py-0.5 text-xs font-bold text-ink hover:border-ink"
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
}
