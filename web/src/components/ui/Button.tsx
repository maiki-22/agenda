import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";
import { cva } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-[var(--btn-radius)] border font-medium transition disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-glow))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface))]",
  {
    variants: {
      variant: {
        primary:
          "bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))] border-transparent hover:opacity-95",
        secondary:
          "bg-[rgb(var(--surface-2))] text-[rgb(var(--fg))] border-[rgb(var(--border))] hover:bg-[rgb(var(--surface))]",
        ghost:
          "bg-transparent text-[rgb(var(--fg))] border-transparent hover:bg-[rgb(var(--surface-2))]",
      },
      size: {
        md: "px-4 py-2.5 text-sm",
        lg: "px-5 py-3 text-sm sm:text-base",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: "false",
    },
  },
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", fullWidth = false, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
className={buttonVariants({
          variant,
          size,
          fullWidth: fullWidth ? "true" : "false",
          className,
          })}
        {...props}
      />
    );
  },
);
