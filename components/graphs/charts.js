import { formatDollars } from "../lib/leftover";

function barWidth(amount, scale) {
  if (!scale || amount <= 0) return 0;
  return Math.min(100, (amount / scale) * 100);
}

export function BarRows({ items, scale }) {
  const largest = Math.max(...items.map((item) => Math.max(item.amount, 0)), 0);
  const max = scale || largest;

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.name}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-semibold">{item.name}</span>
            <span className={`text-lg font-semibold tabular-nums ${item.negative ? "text-danger" : ""}`}>
              {formatDollars(item.amount)}
            </span>
          </div>
          <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-paper" aria-hidden="true">
            <div
              className={`h-full rounded-full ${item.barClass || "bg-green"}`}
              style={{ width: `${barWidth(item.amount, max)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function PeriodBars({ items }) {
  const max = Math.max(...items.map((item) => item.amount), 0);

  return (
    <div className="scroll-strip -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul
        className="flex items-end gap-3"
        style={{ minWidth: `${Math.max(items.length, 1) * 76}px` }}
      >
        {items.map((item) => {
          const height = max > 0 ? Math.max((item.amount / max) * 100, 6) : 0;
          return (
            <li key={item.key} className="flex w-16 shrink-0 flex-col items-center">
              <span className="text-xs font-semibold tabular-nums">{formatDollars(item.amount)}</span>
              <div className="mt-2 flex h-32 w-full items-end" aria-hidden="true">
                <div
                  className={`w-full rounded-lg ${item.current ? "bg-ink" : "bg-green"}`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="mt-2 text-center text-xs text-muted">{item.label}</span>
              <span className="sr-only">{item.fullLabel}{item.current ? ", this paycheck" : ""}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
