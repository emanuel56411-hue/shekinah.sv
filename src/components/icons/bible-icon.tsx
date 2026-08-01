import { cn } from "@/lib/utils";

type BibleIconProps = {
  className?: string;
  strokeWidth?: number;
};

/** Ícono minimalista de Biblia (libro cerrado con marcador). */
export function BibleIcon({ className, strokeWidth = 1.75 }: BibleIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path d="M5 4.5h11.5a2 2 0 0 1 2 2V19a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 19V4.5Z" />
      <path d="M5 4.5A1.5 1.5 0 0 0 3.5 6v13A1.5 1.5 0 0 0 5 20.5" />
      <path d="M9 8.5h6" />
      <path d="M12 8.5v5.25" />
      <path d="M14.5 3.75v4.5l-1.75-1.1-1.75 1.1V3.75" />
    </svg>
  );
}
