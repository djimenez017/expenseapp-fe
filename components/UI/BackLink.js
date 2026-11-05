import Link from "next/link";

export default function BackLink({ href = "/dashboard", children = "Dashboard" }) {
  return (
    <Link href={href}>
      <a className="-ml-1 inline-flex min-h-[36px] items-center gap-1 rounded-full pr-2 text-sm font-bold text-green hover:text-ink">
        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
          <path
            d="M10 4L6 8l4 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {children}
      </a>
    </Link>
  );
}
