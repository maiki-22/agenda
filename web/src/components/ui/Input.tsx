import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";
import { cva } from "@/lib/cn";

type InputVariant = "default" | "filled";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
}

const inputVariants = cva(
  "w-full rounded-xl border border-[rgb(var(--border))] px-3 py-2 mt-1 text-[rgb(var(--fg))] placeholder:text-[rgb(var(--muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-glow))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface))]",
  {
    variants: {
      variant: {
        default: "bg-[rgb(var(--surface))]",
        filled: "bg-[rgb(var(--surface-2))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, variant = "default", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={inputVariants({ variant, className })}
      {...props}
    />
  );
});
