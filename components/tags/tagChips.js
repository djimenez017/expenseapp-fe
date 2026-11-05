import React from "react";

export default function TagChips({ tags, onSelect }) {
  if (!tags || tags.length === 0) return null;

  return (
    <>
      {tags.map((tag) => (
        <button
          key={tag.id || tag.name}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onSelect) onSelect(tag);
          }}
          className="relative rounded-full bg-paper px-2.5 py-1 text-xs font-bold text-ink transition-colors after:absolute after:-inset-x-1 after:-inset-y-2 after:content-[''] hover:bg-line"
        >
          {tag.name}
        </button>
      ))}
    </>
  );
}
