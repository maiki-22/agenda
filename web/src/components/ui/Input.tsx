import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

type InputVariant = "default" | "filled";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
}

const VARIANT_CLASSES: Record<InputVariant, string> = {
  default: "bg-[rgb(var(--surface))]",
  filled: "bg-[rgb(var(--surface-2))]",
};

function mergeClasses(...classes: Array<string | undefined | false>): string {
  return classes.filter(Boolean).join(" ");
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, variant = "default", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={mergeClasses(
        "w-full rounded-xl border border-[rgb(var(--border))] px-3 py-2 mt-1 text-[rgb(var(--fg))] placeholder:text-[rgb(var(--muted))]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-glow))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface))]",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  );
});
