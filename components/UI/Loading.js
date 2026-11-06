export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper/80">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-green"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
