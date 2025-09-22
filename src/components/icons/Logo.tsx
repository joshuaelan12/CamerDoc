import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-2", className)}>
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <path
        d="M9 12C9 10.3431 10.3431 9 12 9H20C21.6569 9 23 10.3431 23 12V20C23 21.6569 21.6569 23 20 23H12C10.3431 23 9 21.6569 9 20V12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 13V19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 16H13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20.5" cy="8.5" r="2.5" fill="currentColor" />
    </svg>
    <span className="font-headline text-xl font-bold">CamerDoc</span>
  </div>
);
