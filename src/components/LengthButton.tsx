import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type LengthChoice = "short" | "medium" | "detailed";

export const LENGTH_OPTIONS: {
  value: LengthChoice;
  label: string;
  hint: string;
}[] = [
  { value: "short", label: "Quick summary", hint: "Crisp overview — key points only" },
  { value: "medium", label: "Balanced explanation", hint: "Concepts + one worked example" },
  { value: "detailed", label: "Detailed Explanation", hint: "Exam-ready, textbook depth" },
];

/**
 * Wide primary button whose onClick expands a length dropdown.
 * The AI call is triggered ONLY when the user picks a length option here.
 */
export function LengthButton({
  label,
  loading,
  disabled,
  onChoose,
  className,
}: {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  onChoose: (choice: LengthChoice) => void;
  className?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled || loading}
        className={cn(
          "inline-flex h-12 w-full min-w-[240px] items-center justify-center gap-2 rounded-md bg-[color:var(--persian-blue)] px-8 text-base font-medium text-white shadow-sm transition hover:bg-[color:var(--persian-blue)]/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto",
          className,
        )}
      >
        <span>{loading ? "Thinking…" : label}</span>
        <ChevronDown
          className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180"
          strokeWidth={3}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-64">
        <DropdownMenuLabel>Choose answer length</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LENGTH_OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onSelect={() => onChoose(opt.value)}
            className="flex-col items-start gap-0.5 py-2"
          >
            <span className="font-medium text-[color:var(--persian-blue)]">
              {opt.label}
            </span>
            <span className="text-xs text-muted-foreground">{opt.hint}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
