"use client";

import CheckIcon from "@/components/icons/CheckIcon";
import { cva, cn } from "@/lib/cn";

interface SelectCardProps {
  title: string;
  subtitle?: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;

  }

const selectCardVariants = cva(
  "w-full text-left rounded-2xl border px-4 py-4 transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110",
  {
    variants: {
      selected: {
        true: "ring-2 ring-[rgb(var(--primary))]",
        false: "",
      },
    },
    defaultVariants: {
      selected: "false",
    },
  },
);

export default function SelectCard({
  title,
  subtitle,
  selected = false,
  onClick,
  disabled,
}: SelectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={selectCardVariants({
        selected: selected ? "true" : "false",
        className: "bg-[rgb(var(--surface-2))] border-[rgb(var(--border))]",
      })}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold leading-tight">{title}</div>
          {subtitle ? (
            <div className="mt-1 text-sm text-[rgb(var(--muted))]">{subtitle}</div>
          ) : null}
        </div>

        <div
          className={cn(
            "h-7 w-7 rounded-full grid place-items-center border",
            selected
              ? "bg-[rgb(var(--primary))] border-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]"
              : "bg-transparent border-[rgb(var(--border))] text-[rgb(var(--muted))]",
           )}
          aria-hidden="true"
        >
          {selected ? (
            <CheckIcon size={16} className="text-[rgb(var(--on-primary))]" />
          ) : null}
        </div>
      </div>
    </button>
  );
}
