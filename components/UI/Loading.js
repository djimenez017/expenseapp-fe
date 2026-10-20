export default function Loading() {
  return (
    <div
      className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center gap-2 bg-white bg-opacity-50"
      role="status"
      aria-label="Loading"
    >
      <span className="h-3 w-3 animate-bounce rounded-full bg-green" />
      <span className="h-3 w-3 animate-bounce rounded-full bg-green [animation-delay:150ms]" />
      <span className="h-3 w-3 animate-bounce rounded-full bg-green [animation-delay:300ms]" />
    </div>
  );
}
